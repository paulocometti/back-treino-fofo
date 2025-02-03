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
    existsByName(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            for (const exercise of this.exercises) {
                if (exercise.name !== name)
                    continue;
                if (id && exercise.id === id)
                    continue;
                if (user_id) {
                    if (exercise.user_id !== null && exercise.user_id !== user_id)
                        continue;
                }
                ;
                return true;
            }
            ;
            return false;
        });
    }
    findByIdAndUserId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            return this.exercises.some(exercise => exercise.id === id && exercise.user_id === user_id);
        });
    }
    insert(input) {
        return __awaiter(this, void 0, void 0, function* () {
            this.exercises.push(input);
            for (const category of input.categories) {
                if (!this.categories.find(c => c.id === category.id)) {
                    this.categories.push(category);
                }
                ;
                this.exercisesCategories.push({
                    exercise_id: input.id,
                    category_id: category.id
                });
            }
            ;
            const categories = this.findCategoriesByExerciseId(input.id);
            const output = exercise_1.Exercise.with({
                id: this.exercises[this.exercises.length - 1].id,
                name: this.exercises[this.exercises.length - 1].name,
                user_id: this.exercises[this.exercises.length - 1].user_id,
                categories: categories
            });
            return output;
        });
    }
    ;
    update(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.exercises.findIndex(ex => ex.id === input.id && ex.user_id === input.user_id);
            if (index === -1)
                return null;
            this.exercises[index] = input;
            this.exercisesCategories = this.exercisesCategories.filter(ec => ec.exercise_id !== input.id);
            const categoriesInput = input.categories;
            for (const category of categoriesInput) {
                if (!this.categories.find(c => c.id === category.id)) {
                    this.categories.push(category);
                }
                ;
                this.exercisesCategories.push({
                    exercise_id: input.id,
                    category_id: category.id
                });
            }
            ;
            const categories = this.findCategoriesByExerciseId(input.id);
            const output = exercise_1.Exercise.with({
                id: input.id,
                name: input.name,
                user_id: input.user_id,
                categories: categories
            });
            return output;
        });
    }
    select(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            const exercise = this.exercises.find(t => {
                if (t.id !== id)
                    return false;
                if (user_id) {
                    if (t.user_id !== null && t.user_id !== user_id)
                        return false;
                }
                else {
                    if (t.user_id !== null)
                        return false;
                }
                ;
                return true;
            });
            if (!exercise)
                return null;
            const categories = this.findCategoriesByExerciseId(exercise.id);
            return exercise_1.Exercise.with({
                id: exercise.id,
                name: exercise.name,
                user_id: exercise.user_id,
                categories: categories
            });
        });
    }
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
}
exports.ExerciseRepositoryInMemory = ExerciseRepositoryInMemory;
