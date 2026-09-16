import request from 'supertest';
import { app, RouterPaths } from "../../src/app";
import {usersCoursesBindingsTestsManager} from "../utils/UsersCoursesBindingsTestsManager";
import {
    CreateUserCourseBindingModel
} from "../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";
import {usersTestsManager} from "../utils/UsersTestsManager";
import {coursesTestsManager} from "../utils/CoursesTestsManager";
import {HTTP_STATUSES} from "../../src/utils";

const getRequest = () => {
    return request(app);
};

describe('tests for /users-courses-bindings', () => {
    beforeAll(async () => {
        await getRequest().delete(`${RouterPaths.__test__}/data`)
    });

    it(`shouldn't create course binding because courseBinding is already exists`, async () => {
        const createUserResult = await usersTestsManager.createUser({ userName: 'dimych' });
        const createCourseResult = await coursesTestsManager.createCourse({ title: 'front-end' });

        const data: CreateUserCourseBindingModel = {
            userId: createUserResult.createdEntity.id,
            courseId: createCourseResult.createdEntity.id };

        await usersCoursesBindingsTestsManager.createBinding(data);
        await usersCoursesBindingsTestsManager.createBinding(data, HTTP_STATUSES.BAD_REQUEST_400);
    });
});
