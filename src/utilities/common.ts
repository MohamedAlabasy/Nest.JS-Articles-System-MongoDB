// PASSWORD RULE
export const PASSWORD_RULE: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$/;
export const PASSWORD_MESSAGE: object = { message: 'Password should have 1 upper case, lowercase letter along with a number and special character.' }

// Emoji Type
export enum EmojiType {
    LIKE = 'like',
    SMILE = 'smile',
    LOVE = 'love',
    ANGRY = 'angry',
}
export const EMOJI_OPTION: string[] = ['like', 'smile', 'love', 'angry']
export const EMOJI_MESSAGE: object = { message: 'type must be like or smile or love or angry' }


// REGISTER CODE
export const REGISTER_CODE: number = Math.floor(100000 + Math.random() * 900000);
export const EXPIRE_CODE_TIME: number = 3600000;

// select
export const SELECT: string = '-__v';
