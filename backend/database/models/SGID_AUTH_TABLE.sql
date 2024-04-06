CREATE TABLE authentication (
  sessionId VARCHAR(255) NOT NULL,
  codeChallenge VARCHAR(255) NOT NULL,
  codeVerifier VARCHAR(255) NOT NULL,
  authorizationURL VARCHAR(255) NOT NULL,
  authorizationNonce VARCHAR(255) NOT NULL,
  authorizationScope VARCHAR(255) NOT NULL,
  accessToken VARCHAR(255) NOT NULL,
  accessTokenSub VARCHAR(255) NOT NULL,
  PRIMARY KEY (sessionId)
)