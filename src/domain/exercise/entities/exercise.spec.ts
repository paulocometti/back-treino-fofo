import { describe, it, expect } from "vitest";
import { faker } from '@faker-js/faker';
import { Exercise, ExerciseCreateProps } from "../../exercise/entities/exercise";
import { z } from "zod";

describe("Exercise Entity Test ", () => {
    it("deve criar um Exercicio com nome e id válidos para um Usuario com role Admin", () => {
        const exerciseName: string = faker.person.firstName('female');
        
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseCreateProps = {
            name: exerciseName,
            
            user_id: exerciseUserIdAdmin
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        
        expect(exercise.user_id).toBe(exerciseUserIdAdmin);
    });

    it("deve criar um Exercicio com nome e id válidos para um Usuario com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseCreateProps = {
            name: exerciseName,
            
            user_id: exerciseUserIdUser
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve criar um Exercicio com nome, category e id válidos para um Usuario com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        const categoryIdRandom: string | null = crypto.randomUUID();
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseCreateProps = {
            name: exerciseName,
            
            user_id: exerciseUserIdUser
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve criar um Exercicio com nome e id válidos e category = null para um Usuario com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        const categoryIdRandom: string | null = null;
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseCreateProps = {
            name: exerciseName,
            
            user_id: exerciseUserIdUser
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve lançar um erro ao criar um Exercicio com nome inválido", () => {
        const name = "";
        
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseCreateProps = {
            name,
            
            user_id: exerciseUserIdAdmin
        };
        expect(() => {
            Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar um Exercicio com nome muito longo", () => {
        const longName = "a".repeat(31);
        
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseCreateProps = {
            name: longName,
            
            user_id: exerciseUserIdAdmin
        };
        expect(() => {
            Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });
    
    it("deve criar um Exercicio usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        
        const exerciseUserIdAdmin: string | null = null;
        const exercise = Exercise.with({ id, name,  user_id: exerciseUserIdAdmin });

        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe(id);
        expect(exercise.name).toBe(name);
        
        expect(exercise.user_id).toBe(exerciseUserIdAdmin);
    });

    it("deve criar um Exercicio usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        
        const exerciseUserIdUser = crypto.randomUUID();
        const exercise = Exercise.with({ id, name,  user_id: exerciseUserIdUser });

        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe(id);
        expect(exercise.name).toBe(name);
        
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve lançar um erro ao criar um Exercicio com props 'id' inválido", () => {
        const id = "1";
        const exerciseName: string = faker.person.firstName('female');
        
        const exerciseUserIdAdmin: string | null = null;
        expect(() => {
            Exercise.with({ id, name: exerciseName,  user_id: exerciseUserIdAdmin });
        }).toThrowError("Id inválido, não é um UUID.");
    });

    it("deve lançar um erro ao criar um Exercicio com props 'nome' inválido", () => {
        const id = faker.string.uuid();
        
        const exerciseUserIdAdmin: string | null = null;
        expect(() => {
            Exercise.with({ id, name: "",  user_id: exerciseUserIdAdmin });
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar um Exercicio com props 'user_id' inválido", () => {
        const id = faker.string.uuid();
        
        const exerciseName: string = faker.person.firstName('female');
        const exerciseUserIdAdmin: string | null = "1";
        expect(() => {
            Exercise.with({ id, name: exerciseName,  user_id: exerciseUserIdAdmin });
        }).toThrowError("Selecione um Usuário válido!");
    });

});