import * as jwt from 'jsonwebtoken';

export function GET_ID_FROM_TOKEN(_headers): string {
    return jwt.decode(_headers["authorization"].split(' ')[1])['_id'];
}