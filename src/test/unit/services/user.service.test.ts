import User from "@/databases/rdb/entities/user.entity";
import { userService } from "@/loaders/service.loader";

describe("User service test :)", () => {
  describe("Method checkDuplicateNickname test :)", () => {
    describe("Throw error test :)", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should userRepository findUserByNickname method error", async () => {
        // given
        const fakeNickname = "nickname";

        const error = new Error("Find user error");
        Object.defineProperty(userService, "userRepository", {
          value: {
            findUserByNickname: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(userService.checkDuplicateNickname(fakeNickname));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      let fakeUserInfo: User | null;
      const fakeNickname = "nickname";

      beforeEach(() => {
        fakeUserInfo = null;
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should duplicate nickname", async () => {
        // given
        fakeUserInfo = {} as User;

        Object.defineProperty(userService, "userRepository", {
          value: {
            findUserByNickname: jest.fn().mockResolvedValue(fakeUserInfo),
          },
        });

        // when
        const isDuplicate = await userService.checkDuplicateNickname(fakeNickname);

        // then
        expect(isDuplicate).toBeFalsy();
      });

      test("Should unique nickname", async () => {
        // given
        fakeUserInfo = {} as User;

        Object.defineProperty(userService, "userRepository", {
          value: {
            findUserByNickname: jest.fn().mockResolvedValue(null),
          },
        });

        // when
        const isDuplicate = await userService.checkDuplicateNickname(fakeNickname);

        // then
        expect(isDuplicate).toBeTruthy();
      });
    });
  });

  describe("Method getFinalNickname test :)", () => {
    const fakeNickname = "nickname";

    describe("Throw error test :)", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should userService checkDuplicateNickname method error", async () => {
        // given
        const error = new Error("Check duplidate nickname error");
        jest.spyOn(userService, "checkDuplicateNickname").mockRejectedValue(error);

        // when
        const result = expect(userService.getFinalNickname(fakeNickname));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should unique nickname", async () => {
        // given
        jest.spyOn(userService, "checkDuplicateNickname").mockResolvedValue(false);

        // when
        const nickname = await userService.getFinalNickname(fakeNickname);

        // then
        expect(nickname).toBe(fakeNickname);
      });

      test("Should duplicate nickname", async () => {
        // given
        jest.spyOn(userService, "checkDuplicateNickname").mockResolvedValue(true);

        // when
        const nickname = await userService.getFinalNickname(fakeNickname);

        // then
        expect(nickname).not.toBe(fakeNickname);
      });
    });
  });

  describe("Method getUserInfo test :)", () => {
    let fakeUserInfo: User | null;
    const key = 1;
    const type = "kakao";

    beforeEach(() => {
      fakeUserInfo = null;
    });

    describe("Throw error test :)", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should userRepository findUserByOAuth method error", async () => {
        // given
        const error = new Error("Get user info error");
        Object.defineProperty(userService, "userRepository", {
          value: {
            findUserByOAuth: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(userService.getUserInfo(key, type));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      fakeUserInfo = {} as User;

      test("Should get user info", async () => {
        // given
        Object.defineProperty(userService, "userRepository", {
          value: {
            findUserByOAuth: jest.fn().mockResolvedValue(fakeUserInfo),
          },
        });

        // when
        const userInfo = await userService.getUserInfo(key, type);

        // then
        expect(userInfo).toEqual(fakeUserInfo);
      });
    });
  });

  describe("Method join test :)", () => {
    let fakeUserInfo: User | null;
    const key = 1;
    const type = "kakao";
    const nickname = "nickname";

    beforeEach(() => {
      fakeUserInfo = null;
    });

    describe("Throw error test :)", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should userService getFinalNickname method error", async () => {
        // given
        const error = new Error("Get nickname error");
        jest.spyOn(userService, "getFinalNickname").mockRejectedValue(error);

        // when
        const result = expect(userService.join(key, type, nickname));

        // then
        await result.rejects.toThrowError(error);
      });

      test("Should userRepository saveUser method error", async () => {
        // given
        jest.spyOn(userService, "getFinalNickname").mockResolvedValue(nickname);

        const error = new Error("Save user error");
        Object.defineProperty(userService, "userRepository", {
          value: {
            saveUser: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(userService.join(key, type, nickname));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      fakeUserInfo = {} as User;

      test("Should join user", async () => {
        // given
        jest.spyOn(userService, "getFinalNickname").mockResolvedValue(nickname);

        Object.defineProperty(userService, "userRepository", {
          value: {
            findUserByOAuth: jest.fn().mockResolvedValue(fakeUserInfo),
          },
        });

        // when
        const userInfo = await userService.getUserInfo(key, type);

        // then
        expect(userInfo).toEqual(fakeUserInfo);
      });
    });
  });

  describe("Method login test :)", () => {
    let fakeUserInfo: User | null;
    const key = 1;
    const type = "kakao";
    const nickname = "nickname";

    describe("Throw error test :)", () => {
      beforeAll(() => {
        fakeUserInfo = null;
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should userService getUserInfo method error", async () => {
        // given
        const error = new Error("Get user info error");
        jest.spyOn(userService, "getUserInfo").mockRejectedValue(error);

        // when
        const result = expect(userService.login(key, type, nickname));

        // then
        await result.rejects.toThrowError(error);
      });

      test("Should userService join method error", async () => {
        // given
        jest.spyOn(userService, "getUserInfo").mockResolvedValue(null);

        const error = new Error("Save user info error");
        jest.spyOn(userService, "join").mockRejectedValue(error);

        // when
        const result = expect(userService.login(key, type, nickname));

        // then
        await result.rejects.toThrowError(error);
      });

      test("Should authService saveRefreshToken method error", async () => {
        // given
        fakeUserInfo = {} as User;
        jest.spyOn(userService, "getUserInfo").mockResolvedValue(fakeUserInfo);

        const fakeTokens = {
          accessToken: "access token",
          refreshToken: "refresh token",
        };
        Object.defineProperty(userService, "authService", {
          value: {
            generateToken: jest.fn().mockReturnValue(fakeTokens),
          },
        });

        const error = new Error("Save refresh token error");
        Object.defineProperty(userService, "authService", {
          value: {
            saveRefreshToken: jest.fn().mockRejectedValue(error),
          },
        });

        // when
        const result = expect(userService.login(key, type, nickname));

        // then
        await result.rejects.toThrowError(error);
      });
    });

    describe("No problem test :)", () => {
      const fakeTokens = {
        accessToken: "access token",
        refreshToken: "refresh token",
      };

      beforeAll(() => {
        fakeUserInfo = {} as User;
      });

      beforeEach(() => {
        Object.defineProperty(userService, "authService", {
          value: {
            generateToken: jest.fn().mockReturnValue(fakeTokens),
          },
        });

        Object.defineProperty(userService, "authService", {
          value: {
            saveRefreshToken: jest.fn().mockResolvedValue(true),
          },
        });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test("Should new user login", async () => {
        // given
        jest.spyOn(userService, "getUserInfo").mockResolvedValue(fakeUserInfo);
        fakeUserInfo = {} as User;
        jest.spyOn(userService, "join").mockResolvedValue(fakeUserInfo);

        // when
        const loginInfo = await userService.login(key, type, nickname);

        // then
        expect(loginInfo.accessToken).toBe(fakeTokens.accessToken);
        expect(loginInfo.refreshToken).toBe(fakeTokens.refreshToken);
        expect(loginInfo.userInfo).toEqual(fakeUserInfo);
      });

      test("Should new user login", async () => {
        // given
        fakeUserInfo = {} as User;
        jest.spyOn(userService, "getUserInfo").mockResolvedValue(fakeUserInfo);

        // when
        const loginInfo = await userService.login(key, type, nickname);

        // then
        expect(loginInfo.accessToken).toBe(fakeTokens.accessToken);
        expect(loginInfo.refreshToken).toBe(fakeTokens.refreshToken);
        expect(loginInfo.userInfo).toEqual(fakeUserInfo);
      });
    });
  });
});
