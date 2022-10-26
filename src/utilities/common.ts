// password reg
export const PASSWORD_RULE: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$/;
export const PASSWORD_MESSAGE: object = { message: 'Password should have 1 upper case, lowercase letter along with a number and special character.' }

// database Emoji Type
export enum EmojiType {
    LIKE = 'like',
    SMILE = 'smile',
    LOVE = 'love',
    ANGRY = 'angry',
}
export const EMOJI_OPTION: string[] = ['like', 'smile', 'love', 'angry']
export const EMOJI_MESSAGE: object = { message: 'type must be like or smile or love or angry' }


// send email code and expire time 
export const REGISTER_CODE: number = Math.floor(100000 + Math.random() * 900000);
export const EXPIRE_CODE_TIME: number = 3600000;

// remove from database return object 
export const SELECT: string = '-__v';

// remove from database return object 
export const BASE_URL: string = 'http://127.0.0.1:3000';