import { app, RouterPaths } from "../../src/app";
import { HTTP_STATUSES, HttpStatusType } from "../../src/utils";
import request, { Response } from "supertest";
import { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";

export const coursesTestsManager = {
    async createCourse(
        data: CreateCourseModel,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ): Promise<{ response: Response, createdEntity: any }> {
        const response = await request(app)
            .post(RouterPaths.courses)
            .send(data)
            .expect(expectedStatusCode);

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(Number),
                title: data.title
            });
        }

        return { response: response, createdEntity: createdEntity };
    }
};

