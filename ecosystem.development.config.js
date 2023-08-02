module.exports = {
    apps: [
      {
        exec_mode: "cluster", // 실행 모드
        name: "lip-api-server-development", // 이름
        script: "./dist/index.js", // 실행 파일
        watch: false, // 실시간 변경 확인 여부
        out_file: "/logs/development/lip-api-server/lip-api-server-out.log", // 로그 파일 경로
        error_file: "/logs/development/lip-api-server/lip-api-server-error.log", // 에러 로그 파일 경로
      },
    ],
  };
  