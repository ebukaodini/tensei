import { setup, gql, fakeUser } from './setup'

import Supertest from 'supertest'
import { auth } from '@tensei/auth'
import { graphql } from '@tensei/graphql'

test('registered user can enable, confirm and disable 2-factor authentication', async () => {
    const { app, ctx } = await setup([
        auth().twoFactorAuth().user('Student').plugin(),
        graphql().plugin()
    ])

    const client = Supertest(app)

    const fakeUserDetails = fakeUser()

    const register_response = await client.post(`/graphql`).send({
        query: gql`
            mutation register_student($email: String!, $password: String!) {
                register_student(
                    object: { email: $email, password: $password }
                ) {
                    student {
                        id
                        email
                    }
                    access_token
                }
            }
        `,
        variables: {
            email: fakeUserDetails.email,
            password: 'password'
        }
    })

    expect(register_response.status).toBe(200)

    const enable_2fa_response = await client
        .post(`/graphql`)
        .send({
            query: gql`
                mutation enable_student_two_factor_auth {
                    enable_student_two_factor_auth {
                        dataURL
                    }
                }
            `
        })
        .set(
            'Authorization',
            `Bearer ${register_response.body.data.register_student.access_token}`
        )

    expect(enable_2fa_response.status).toBe(200)
    expect(
        enable_2fa_response.body.data.enable_student_two_factor_auth.dataURL
    ).toMatch('data:image/png;base64')

    const user = await ctx.orm.em.findOne<{
        id: string
        two_factor_secret: string
        email: string
    }>('Student', {
        email: fakeUserDetails.email
    })

    const Speakeasy = require('speakeasy')

    const totp = Speakeasy.totp({
        secret: user.two_factor_secret,
        encoding: 'base32'
    })

    const confirm_enable_2fa_response = await client
        .post(`/graphql`)
        .send({
            query: gql`
                mutation confirm_student_enable_two_factor_auth($token: Int!) {
                    confirm_student_enable_two_factor_auth(
                        object: { token: $token }
                    ) {
                        id
                        two_factor_enabled
                    }
                }
            `,
            variables: {
                token: parseInt(totp)
            }
        })
        .set(
            'Authorization',
            `Bearer ${register_response.body.data.register_student.access_token}`
        )

    expect(confirm_enable_2fa_response.status).toBe(200)
    expect(
        confirm_enable_2fa_response.body.data
            .confirm_student_enable_two_factor_auth
    ).toEqual({
        id: user.id,
        two_factor_enabled: true
    })

    const disable_2fa_response = await client
        .post(`/graphql`)
        .send({
            query: gql`
                mutation disable_student_two_factor_auth($token: Int!) {
                    disable_student_two_factor_auth(object: { token: $token }) {
                        id
                        two_factor_enabled
                    }
                }
            `,
            variables: {
                token: parseInt(totp)
            }
        })
        .set(
            'Authorization',
            `Bearer ${register_response.body.data.register_student.access_token}`
        )

    expect(disable_2fa_response.status).toBe(200)
    expect(
        disable_2fa_response.body.data.disable_student_two_factor_auth
    ).toEqual({
        id: user.id,
        two_factor_enabled: false
    })
})
