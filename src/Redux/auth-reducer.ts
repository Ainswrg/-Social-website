import { ResultCodeEnum, ResultCodeForCaptchaEnum } from "../api/api";
import { authAPI } from "../api/auth-api";
import { securityAPI } from "../api/security-api";
import { ProfileType } from "../types/Types";

const SET_USER_DATA = "SET_USER_DATA";
const SET_PROFILE_DATA = "SET_PROFILE_DATA";
const GET_CAPTCHA_URL_SUCCESS = 'samurai-network/auth/GET_CAPTCHA_URL_SUCCESS';

export type InitialStateType2 = { 
   userId: number | null;
   email: string | null;
   login: string | null;
   isAuth: boolean
   profile: ProfileType | null;
   captchaUrl: string | null;
}

let initialState = {
   userId: null as number | null,
   email: null as string | null,
   login: null as string | null,
   isAuth: false,
   profile: null as ProfileType | null,
   captchaUrl: null as string | null,
};

export type InitialStateType = typeof initialState;


const authReducer = (state = initialState, action: any): InitialStateType => {
   switch (action.type) {
      case SET_USER_DATA:
      case GET_CAPTCHA_URL_SUCCESS:
      case SET_PROFILE_DATA:
         return {
            ...state,
            ...action.payload
         };
      default:
         return state;
   }
};

type ActionType = SetAuthUserDataActionType | getCaptchaUrlSuccessActionType | setProfileDataActionType

type SetAuthUserDataActionPayloadType = {
   userId: number | null, 
   email: string | null, 
   login: string | null, 
   isAuth: boolean
}

type SetAuthUserDataActionType = {
   type: typeof SET_USER_DATA,
   payload: SetAuthUserDataActionPayloadType
}

export const setAuthUserData = (userId: number | null, email: string | null, login: string | null, isAuth: boolean): SetAuthUserDataActionType => ({
   type: SET_USER_DATA,
   payload: { userId, email, login, isAuth },
});


type getCaptchaUrlSuccessActionType = {
   type: typeof GET_CAPTCHA_URL_SUCCESS,
   payload: {captchaUrl: string },
}

export const getCaptchaUrlSuccess = (captchaUrl: string): getCaptchaUrlSuccessActionType => ({
   type: GET_CAPTCHA_URL_SUCCESS,
   payload: { captchaUrl },
});

export const setProfileData = (profile: ProfileType) => ({
   type: SET_PROFILE_DATA,
   profile,
});

type setProfileDataActionType = {
   type: typeof SET_PROFILE_DATA,
   profile: ProfileType
}

export const getAuthUserData = () => async (dispatch: any) => {
   let meData = await authAPI.me();

   if (meData.resultCode === ResultCodeEnum.Success) {
      let { id, email, login } = meData.data;
      dispatch(setAuthUserData(id, email, login, true));
   }
};

export const login = (email: string, password: string, rememberMe: boolean, captcha: string, actions: any) => {
   return async (dispatch: any) => {
      let data = await authAPI.login(email, password, rememberMe,captcha);
      if (data.resultCode === ResultCodeEnum.Success) {
         dispatch(getAuthUserData());
      } else {
         if(data.resultCode === ResultCodeForCaptchaEnum.CaptchaIsRequired) {
            dispatch(getCaptchaUrl())
         }
         let message = data.messages.length > 0
            ? data.messages[0]
            : "Some Error";
         actions.setStatus(message);
      }
      actions.setSubmitting(false);
   };
};

export const getCaptchaUrl = () => async (dispatch: any) => {
   const data = await securityAPI.getCaptchaUrl();
   const captchaUrl = data.url;

   dispatch(getCaptchaUrlSuccess(captchaUrl));
};

export const logout = () => {
   return async (dispatch: any) => {
      let data = await authAPI.logout();
      if (data.resultCode === ResultCodeEnum.Success) {
         dispatch(setAuthUserData(null, null, null, false));
      }
   };
};

export default authReducer;
