const response = (error: any, status: number, message: string) => {
  console.error(error);
  return new Response(message, { status });
};

export const catchRouteError = async (
  responsePromise: () => Promise<Response>
) => {
  try {
    return await responsePromise();
  } catch (error) {
    if (typeof error === "object" && error !== null) {
      const code =
        "code" in error && typeof error.code === "string" ? error.code : "";
      const message =
        "message" in error && typeof error.message === "string"
          ? error.message
          : "";
      const cause =
        "cause" in error
          ? typeof error.cause === "string"
            ? error.cause
            : typeof error.cause === "object" &&
              typeof error.cause === "object" &&
              error.cause !== null &&
              "message" in error.cause &&
              typeof error.cause.message === "string"
            ? error.cause.message
            : ""
          : "";

      if (code.match(/^ERR_JWS_/)) {
        return response(error, 401, "Invalid JWT");
      }
      if (message === "fetch failed") {
        if (cause) {
          return response(error, 403, `Failed to fetch: ${cause}`);
        }
        return response(error, 403, "Failed to fetch");
      }
    }
    throw error;
  }
};
