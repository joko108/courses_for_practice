import { app, RouterPaths } from "../../src/app";
import { HTTP_STATUSES, HttpStatusType } from "../../src/utils";
import request, { Response } from "supertest";
import {
    CreateUserCourseBindingModel
} from "../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";

export const usersCoursesBindingsTestsManager = {
    async createBinding(
        data: CreateUserCourseBindingModel,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ): Promise<{ response: Response, createdEntity: any }> {
        const response = await request(app)
            .post(RouterPaths.usersCoursesBindings)
            .send(data)
            .expect(expectedStatusCode);

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                userId: data.userId,
                courseId: data.courseId,
                userName: expect.any(String),
                courseTitle: expect.any(String),
            });
        }

        return { response, createdEntity };
    }
};
