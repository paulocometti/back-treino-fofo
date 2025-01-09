"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseRepositoryInMemory = void 0;
const exercise_1 = require("../../../domain/exercise/entities/exercise");
const category_1 = require("../../../domain/category/entities/category");
class ExerciseRepositoryInMemory {
    constructor() {
        this.exercises = [];
        this.categories = [];
        this.exercisesCategories = [];
    }
    static create() {
        return new ExerciseRepositoryInMemory();
    }
    ;
    findCategoriesByExerciseId(exerciseId) {
        return this.exercisesCategories
            .filter(ec => ec.exercise_id === exerciseId)
            .map(ec => {
            const foundCategory = this.categories.find(c => c.id === ec.category_id);
            if (!foundCategory)
                throw new Error("Category not found");
            return category_1.Category.with(foundCategory);
        });
    }
    ;
    existsByName(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            return this.exercises.some(exercise => exercise.name === name && (!id || exercise.id !== id) && (!user_id || exercise.user_id === user_id));
        });
    }
    ;
    findByIdAndUserId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            return this.exercises.some(exercise => exercise.id === id && exercise.user_id === user_id);
        });
    }
    ;
    insert(inputExercise, inputCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            this.exercises.push(inputExercise);
            inputCategories.forEach(category => {
                this.exercisesCategories.push({
                    exercise_id: inputExercise.id,
                    category_id: category.id
                });
                if (!this.categories.find(c => c.id === category.id)) {
                    this.categories.push(category);
                }
            });
            const categories = this.findCategoriesByExerciseId(inputExercise.id);
            return exercise_1.Exercise.with({
                id: inputExercise.id,
                name: inputExercise.name,
                user_id: inputExercise.user_id,
                categories: categories
            });
        });
    }
    ;
    update(inputExercise, inputCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.exercises.findIndex(ex => ex.id === inputExercise.id && ex.user_id === inputExercise.user_id);
            //if (index === -1) throw new Error("Exercise not found");
            this.exercisesCategories = this.exercisesCategories.filter(ec => ec.exercise_id !== inputExercise.id);
            inputCategories.forEach(category => {
                this.exercisesCategories.push({
                    exercise_id: inputExercise.id,
                    category_id: category.id
                });
            });
            const categories = this.findCategoriesByExerciseId(inputExercise.id);
            this.exercises[index] = exercise_1.Exercise.with({
                id: inputExercise.id,
                name: inputExercise.name,
                user_id: inputExercise.user_id,
                categories: categories
            });
            return this.exercises[index];
        });
    }
    ;
    select(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            const foundExercise = this.exercises.find(ex => ex.id === id && (!user_id || ex.user_id === user_id));
            if (!foundExercise)
                return null;
            const categories = this.findCategoriesByExerciseId(foundExercise.id);
            return exercise_1.Exercise.with({
                id: foundExercise.id,
                name: foundExercise.name,
                user_id: foundExercise.user_id,
                categories: categories
            });
        });
    }
    ;
    list(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = input;
            const filteredExercises = this.exercises.filter(ex => ex.user_id === user_id || ex.user_id === null);
            return filteredExercises.map(ex => {
                const categories = this.findCategoriesByExerciseId(ex.id);
                return exercise_1.Exercise.with({
                    id: ex.id,
                    name: ex.name,
                    user_id: ex.user_id,
                    categories: categories
                });
            });
        });
    }
    ;
}
exports.ExerciseRepositoryInMemory = ExerciseRepositoryInMemory;
;
