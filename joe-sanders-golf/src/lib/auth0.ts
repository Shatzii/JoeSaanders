// Mock auth for development - replace with real Auth0 when configured
const mockAuth = {
  getSession: async (request?: any) => ({ user: { sub: 'dev-user' } }),
  withApiAuthRequired: (handler: any) => handler,
  withPageAuthRequired: (handler: any) => handler,
}

export default mockAuth
