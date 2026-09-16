import { app, RouterPaths } from "../../src/app";
import { HTTP_STATUSES, HttpStatusType } from "../../src/utils";
import { CreateUserModel } from "../../src/features/users/models/CreateUserModel";
import request, { Response } from "supertest";

export const usersTestsManager = {
    async createUser(
        data: CreateUserModel,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ): Promise<{ response: Response, createdEntity: any }> {
        const response = await request(app)
            .post(RouterPaths.users)
            .send(data)
            .expect(expectedStatusCode);

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(Number),
                userName: data.userName
            });
        }

        return { response, createdEntity };
    }
};
