import * as jwt from 'jsonwebtoken';

export function GET_ID_FROM_TOKEN(_headers): number {
    return jwt.decode(_headers["authorization"].split(' ')[1])['id'];
}