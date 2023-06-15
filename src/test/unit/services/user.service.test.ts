import User from "@/databases/rdb/entities/user.entity";
import { authService } from "@/loaders/service.loader";

describe("Method checkDuplicateNickname test :)", () => {
  const fakeNickname = "nickname";
  const fakeUserInfo = {} as User;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should throw error when userRepository findUserByNickname method error", async () => {
    // given
    const error = new Error("Find user error");
    Object.defineProperty(authService, "userRepository", {
      value: {
        findUserByNickname: jest.fn().mockRejectedValue(error),
      },
    });

    // when
    const result = expect(authService.checkDuplicateNickname(fakeNickname));

    // then
    await result.rejects.toThrowError(error);
  });

  test("Should success on duplicate nickname", async () => {
    // given
    Object.defineProperty(authService, "userRepository", {
      value: {
        findUserByNickname: jest.fn().mockResolvedValue(fakeUserInfo),
      },
    });

    // when
    const isDuplicate = await authService.checkDuplicateNickname(fakeNickname);

    // then
    expect(isDuplicate).toBeTruthy();
  });

  test("Should success on unique nickname", async () => {
    // given
    // when
    const isDuplicate = await authService.checkDuplicateNickname(fakeNickname);

    // then
    expect(isDuplicate).toBeFalsy();
  });
});

describe("Method getFinalNickname test :)", () => {
  const fakeNickname = "nickname";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should throw error when authService checkDuplicateNickname method error", async () => {
    // given
    const error = new Error("Check duplidate nickname error");
    jest.spyOn(authService, "checkDuplicateNickname").mockRejectedValue(error);

    // when
    const result = expect(authService.getFinalNickname(fakeNickname));

    // then
    await result.rejects.toThrowError(error);
  });

  test("Should unique nickname", async () => {
    // given
    jest.spyOn(authService, "checkDuplicateNickname").mockResolvedValue(false);

    // when
    const nickname = await authService.getFinalNickname(fakeNickname);

    // then
    expect(nickname).toBe(fakeNickname);
  });

  test("Should duplicate nickname", async () => {
    // given
    jest.spyOn(authService, "checkDuplicateNickname").mockResolvedValue(true);

    // when
    const nickname = await authService.getFinalNickname(fakeNickname);

    // then
    expect(nickname).not.toBe(fakeNickname);
  });
});

// describe("Method getSocialUserInfo test :)", () => {
//   const fakeUserInfo = {
//     id: 0,
//     nickname: "",
//   };
//   const type = "kakao";
//   const code = "12341234";

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   beforeEach(() => {
//     Object.defineProperty(userService, "socialCommuicator", {
//       value: {
//         getUserInfo: jest.fn().mockResolvedValue(fakeUserInfo),
//       },
//     });
//   });

//   test("Should throw error when socialCommuicator getUserInfo method error", async () => {
//     // given
//     const error = new Error("socialCommuicator get user info error");
//     Object.defineProperty(userService, "socialCommuicator", {
//       value: {
//         getUserInfo: jest.fn().mockRejectedValue(error),
//       },
//     });

//     // when
//     const result = expect(userService.getSocialUserInfo(code, type));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should get social user info", async () => {
//     // given
//     // when
//     const userInfo = await userService.getSocialUserInfo(code, type);

//     // then
//     expect(userInfo).toEqual(fakeUserInfo);
//   });
// });

// describe("Method getUserInfoByNickname test :)", () => {
//   const fakeUserInfo = {} as User;
//   const nickname = "fake nickname";

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   beforeEach(() => {
//     Object.defineProperty(userService, "userRepository", {
//       value: {
//         findUserBySocial: jest.fn().mockResolvedValue(fakeUserInfo),
//       },
//     });
//   });

//   test("Should throw error when userRepository findUserByNickname method error", async () => {
//     // given
//     const error = new Error("find user info error");
//     Object.defineProperty(userService, "userRepository", {
//       value: {
//         findUserByNickname: jest.fn().mockRejectedValue(error),
//       },
//     });

//     // when
//     const result = expect(userService.getUserInfoByNickname(nickname));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should success", async () => {
//     // given
//     // when
//     const userInfo = await userService.getUserInfoByNickname(nickname);

//     // then
//     expect(userInfo).toBe(fakeUserInfo);
//   });
// });

// describe("Method join test :)", () => {
//   const fakeUserInfo = {} as User;
//   const key = 1;
//   const type = "kakao";
//   const nickname = "nickname";

//   beforeEach(() => {
//     jest.spyOn(userService, "getFinalNickname").mockResolvedValue(nickname);

//     Object.defineProperty(userService, "userRepository", {
//       value: {
//         findUserBySocial: jest.fn().mockResolvedValue(fakeUserInfo),
//       },
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test("Should throw error when userService getFinalNickname method error", async () => {
//     // given
//     const error = new Error("get final nickname error");
//     jest.spyOn(userService, "getFinalNickname").mockRejectedValue(error);

//     // when
//     const result = expect(userService.join(key, type, nickname));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should throw error when userRepository saveUser method error", async () => {
//     // given
//     const error = new Error("Save user error");
//     Object.defineProperty(userService, "userRepository", {
//       value: {
//         saveUser: jest.fn().mockRejectedValue(error),
//       },
//     });

//     // when
//     const result = expect(userService.join(key, type, nickname));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should join user", async () => {
//     // given
//     // when
//     const userInfo = await userService.join(key, type, nickname);

//     // then
//     expect(userInfo).toEqual(fakeUserInfo);
//   });
// });

// describe("Method login test :)", () => {
//   let fakeUser: User | null = null;
//   const nickname = "fake nickname";
//   const type = "kakao";
//   const key = 1;
//   const tokens = {
//     accessToken: "access token",
//     refreshToken: "refresh token",
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   beforeEach(() => {
//     fakeUser = {} as User;
//     jest.spyOn(userService, "getUserInfoByNickname").mockResolvedValue(fakeUser);
//     Object.defineProperty(userService, "authService", {
//       value: {
//         generateToken: jest.fn().mockReturnValue(tokens),
//         saveRefreshToken: jest.fn().mockResolvedValue(true),
//       },
//     });
//   });

//   test("Should throw error when userService getUserInfo method error", async () => {
//     // given
//     const error = new Error("Get user info error");
//     jest.spyOn(userService, "getUserInfoByNickname").mockRejectedValue(error);

//     // when
//     const result = expect(userService.login(nickname, type));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should throw error when not found user and not exist social key", async () => {
//     // given
//     fakeUser = null;
//     const error = new Error("Not exist user.. :(");

//     // when
//     const result = expect(userService.login(nickname, type));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should throw error when userService join method error", async () => {
//     // given
//     fakeUser = null;

//     const error = new Error("join error");
//     jest.spyOn(userService, "join").mockRejectedValue(error);

//     // when
//     const result = expect(userService.login(nickname, type, key));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should throw error when userService saveRefreshToken method error", async () => {
//     // given
//     const error = new Error("save refresh token error");
//     Object.defineProperty(userService, "authService", {
//       value: {
//         saveRefreshToken: jest.fn().mockRejectedValue(error),
//       },
//     });

//     // when
//     const result = expect(userService.login(nickname, type));

//     // then
//     await result.rejects.toThrowError(error);
//   });

//   test("Should success", async () => {
//     // given
//     const response = {
//       ...fakeUser,
//       ...tokens,
//     };

//     // when
//     const result = await userService.login(nickname, type);

//     // then
//     expect(result).toBe(response);
//   });
// });
