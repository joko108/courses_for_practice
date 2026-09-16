import request from 'supertest';
import { CreateCourseModel } from "../../src/features/courses/models/CreateCourseModel";
import { UpdateCourseModel } from "../../src/features/courses/models/UpdateCourseModel";
import { app } from "../../src/app";
import { HTTP_STATUSES } from "../../src/utils";
import {coursesTestsManager} from "../utils/CoursesTestsManager";

const getRequest = () => {
    return request(app);
};

describe('tests for /courses', () => {
    beforeAll(async () => {
        await getRequest().delete('/__test__/data')
    });

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it(`shouldn't create course with incorrect input data`, async () => {
        const data: CreateCourseModel = { title: '' };

        await coursesTestsManager.createCourse(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    let createdCourse1: any = null;
    it(`should create course with correct input data`, async () => {
        const data: CreateCourseModel = { title: 'it-incubator course' };

        const result = await coursesTestsManager.createCourse(data);

        createdCourse1 = result.createdEntity;

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1]);
    });

    let createdCourse2: any = null;
    it(`create one more course`, async () => {
        const data: CreateCourseModel = { title: 'it-incubator course 2' }

        const result = await coursesTestsManager.createCourse(data);

        createdCourse2 = result.createdEntity;

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    });

    it(`shouldn't update course with incorrect input data`, async () => {
        const data: UpdateCourseModel = { title: '' };

        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse1);
    });

    it(`shouldn't update course that not exist`, async () => {
        await request(app)
            .put('/courses/' + -100)
            .send({ title: 'good title' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
    });

    it(`should update course with correct input data`, async () => {
        const data: UpdateCourseModel = { title: 'good new title' };

        await request(app)
            .put('/courses/' + createdCourse1.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: data.title
            });

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2);
    });

    it(`should delete both courses`, async () => {
        await request(app)
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .delete('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, []);
    });
});
