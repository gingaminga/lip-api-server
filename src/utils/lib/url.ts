export const KAKAO_URL = {
  API: {
    HOST: "https://kapi.kakao.com",
    PATH: {
      USER_DATA: "/v2/user/me",
    },
  },
  AUTH: {
    HOST: "https://kauth.kakao.com",
    PATH: {
      AUTHORIZE: "/oauth/authorize",
      TOKEN: "/oauth/token",
    },
  },
};

export const NAVER_URL = {
  API: {
    HOST: "https://openapi.naver.com",
    PATH: {
      USER_DATA: "/v1/nid/me",
    },
  },
  AUTH: {
    HOST: "https://nid.naver.com",
    PATH: {
      AUTHORIZE: "/oauth2.0/authorize",
      TOKEN: "/oauth2.0/token",
    },
  },
};
