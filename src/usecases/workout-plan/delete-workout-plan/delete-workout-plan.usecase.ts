import { User } from "../../../domain/user/entities/user";
import { WorkoutPlanGateway } from "../../../domain/workout-plan/workout-plan.gateway";
import { Usecase } from "../../usecase"

export type DeleteWorkoutPlanUsecaseInputDto = {
    id: string
};

export type DeleteWorkoutPlanUsecaseUserInputDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export class DeleteWorkoutPlanUsecase
    implements Usecase<DeleteWorkoutPlanUsecaseInputDto, DeleteWorkoutPlanUsecaseUserInputDto, boolean> {

    private constructor(private readonly workoutPlanGateway: WorkoutPlanGateway) { }

    public static create(workoutPlanGateway: WorkoutPlanGateway) {
        return new DeleteWorkoutPlanUsecase(workoutPlanGateway);
    };

    public async execute(req: DeleteWorkoutPlanUsecaseInputDto, user: DeleteWorkoutPlanUsecaseUserInputDto): Promise<boolean> {
        const { id } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input = { id, user_id: userIdCondition };
        const result = await this.workoutPlanGateway.delete(input);
        if(result === false) throw new Error('Nada encontrado.');
        return true;
    };
};