import { authService } from "@/loaders/service.loader";
import AuthService from "@/services/auth.service";
import { IAccessTokenPayload, IRefreshTokenPayload } from "@/types/token";
import { createJWTToken, verifyJWTToken } from "@/utils/jwt";

jest.mock("@/utils/jwt");
const mockedVerifyJWTToken = jest.mocked(verifyJWTToken);
const mockedCreateJWTToken = jest.mocked(createJWTToken);

describe("Method createAccessToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create access token", () => {
    // given
    const type = "kakao";
    const nickname = "test";
    const accesstoken = "access token";
    mockedCreateJWTToken.mockReturnValue(accesstoken);

    // when
    const token = authService.createAccessToken(nickname, type);

    // then
    expect(token).toBe(accesstoken);
  });
});

describe("Method createRefreshToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create refresh token", () => {
    // given
    const type = "kakao";
    const nickname = "test";
    const refreshToken = "refresh token";
    mockedCreateJWTToken.mockReturnValue(refreshToken);

    // when
    const token = authService.createRefreshToken(nickname, type);

    // then
    expect(token).toBe(refreshToken);
  });
});

describe("Method generateToken", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should get generate token", () => {
    // given
    const nickname = "";
    const type = "kakao";
    const accessToken = "access token";
    const refreshToken = "refresh token";
    jest.spyOn(authService, "createAccessToken").mockReturnValue(accessToken);
    jest.spyOn(authService, "createRefreshToken").mockReturnValue(refreshToken);

    // when
    const tokens = authService.generateToken(nickname, type);

    // then
    const compareResult = {
      accessToken,
      refreshToken,
    };
    expect(tokens).toEqual(compareResult);
  });
});

describe("Method getSocialURL", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should get social url", () => {
    // given
    const type = "kakao";
    const result = "fake url";
    Object.defineProperty(authService, "socialCommuicator", {
      value: {
        getURL: jest.fn().mockReturnValue(result),
      },
    });

    // when
    const url = authService.getSocialURL(type);

    // then
    expect(url).toEqual(result);
  });
});

describe("Method saveRefreshToken", () => {
  const key = "key";
  const token = "refresh token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should redis error", async () => {
    // given
    const error = new Error("Redis error");
    Object.defineProperty(authService, "redisClient", {
      value: {
        set: jest.fn().mockRejectedValue(error),
      },
    });

    // when
    const result = expect(authService.saveRefreshToken(key, token));

    // then
    await result.rejects.toThrowError(error);
  });

  test("Should success", async () => {
    // given
    Object.defineProperty(authService, "redisClient", {
      value: {
        set: jest.fn().mockResolvedValue(undefined),
      },
    });

    // when
    const isSuccess = await authService.saveRefreshToken(key, token);

    // then
    expect(isSuccess).toBeTruthy();
  });
});

describe("Method validateAccessToken", () => {
  const token = "access token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should throw error when expired access token", async () => {
    // given
    const error = new Error("expired access token");
    mockedVerifyJWTToken.mockImplementation(() => {
      throw error;
    });

    await expect(() => {
      AuthService.validateAccessToken(token);
    }).toThrow(error);
  });

  test("Should success", async () => {
    // given
    const result = {} as IAccessTokenPayload;
    mockedVerifyJWTToken.mockReturnValue(result);

    // when
    const payload = AuthService.validateAccessToken(token);

    // then
    expect(payload).toBe(result);
  });
});

describe("Method validateRefreshToken", () => {
  const token = "refresh token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should throw error when expired refresh token", async () => {
    // given
    const error = new Error("expired refresh token");
    mockedVerifyJWTToken.mockImplementation(() => {
      throw error;
    });

    // when
    const result = expect(authService.validateRefreshToken(token));

    // then
    await result.rejects.toThrowError(error);
  });

  test("Should throw error when redis error", async () => {
    // given
    const jwtPayload = {} as IRefreshTokenPayload;
    mockedVerifyJWTToken.mockReturnValue(jwtPayload);

    const error = new Error("redis error");
    Object.defineProperty(authService, "redisClient", {
      value: {
        get: jest.fn().mockRejectedValue(error),
      },
    });

    // when
    const result = expect(authService.validateRefreshToken(token));

    // then
    await result.rejects.toThrowError(error);
  });

  test("Should throw error when token is not same redis response", async () => {
    // given
    const jwtPayload = {} as IRefreshTokenPayload;
    mockedVerifyJWTToken.mockReturnValue(jwtPayload);

    const originRefreshToken = "diffrent refresh token";
    Object.defineProperty(authService, "redisClient", {
      value: {
        get: jest.fn().mockResolvedValue(originRefreshToken),
      },
    });

    const error = new Error("Token is not same.. :(");

    // when
    const result = expect(authService.validateRefreshToken(token));

    // then
    await result.rejects.toThrowError(error);
  });

  test("Should success", async () => {
    // given
    const jwtPayload = {} as IRefreshTokenPayload;
    mockedVerifyJWTToken.mockReturnValue(jwtPayload);

    const originRefreshToken = "refresh token";
    Object.defineProperty(authService, "redisClient", {
      value: {
        get: jest.fn().mockResolvedValue(originRefreshToken),
      },
    });

    // when
    const payload = await authService.validateRefreshToken(token);

    // then
    expect(payload).toBe(jwtPayload);
  });
});
