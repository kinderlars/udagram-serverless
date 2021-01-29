
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJHsJZwe1PvHWKMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1sYjY3aDc4ei5ldS5hdXRoMC5jb20wHhcNMjEwMTA3MDkzMjAxWhcN
MzQwOTE2MDkzMjAxWjAkMSIwIAYDVQQDExlkZXYtbGI2N2g3OHouZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvASif3qSOl+12wtZ
HBstMFl881yN1f/UETRlSHEc8b2Hoq76mfdP5ZeQiiXOOca2IjCHgFxZlusUgVTa
pjH70KqgArs1Zx0ukKLQCJ/Vy+H5YW5UbXezapOOVpmIzCrf9ntIXShxkGHPsvRM
mK5ZzpRod/YPv4VpHb57/YBb7QN7S5UQ6HIRfD/PKVKKndHZkKzkFeCfbCK2xLIx
uQChvdTMCzKjJ0fKY+ztRbY2APvZ/Q8E+ABRFJp8yM7LlDDAjenS6lgnhzq+Dx9e
wj2pFDyOtrjaL3dXH/oHHy4xNfSVUeiPB0YF8dNvEUAH3ibAnocfy33Kyw4iZykE
EKhnGQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQfg+dyEsuC
DV7Jvi08mbHPCU0ZizAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AJ9LonBDNHk3spZFELNjWtbRoq2MqeKkBHv+8uQrVh0e6d0PKn4eoHHw7La/96J3
XEPXxVQmCCmED4xpnhCW7+rEebM2sLzxMYmYkuJuqVrbHUuwdkYTNvQzpsCANZB6
XTulMQUz5mmKcJL9XnRLM/mp+ehESEybClQspqfTnTImxFN3YvwouXaNkVAcmxFz
T5KN0HRbTsKo9oqDt6Ei/D7Vcq80FQiIYUY7X9NQVAU9WaJtkJIHVHd5+6qQcgIw
+hWYxjYAgte7xPwjGhgZVsDwBA8rArnE65Jfg+vENTep9+7feAOCE7hzAO0QlXuK
RhBXDMqNLdYUuEPf7t7+4Fo=
-----END CERTIFICATE-----`;

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try{
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }

  function verifyToken(authHeader: string): JwtToken {
    if (!authHeader)
      throw new Error('No authentication header')
  
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]
  
    return verify(token,cert,{ algorithms: ['RS256'] }) as JwtToken;
  }
}
