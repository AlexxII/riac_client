import { InMemoryCache, makeVar } from '@apollo/client'

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        activeUser: {
          read() {
            return userVar()
          }
        }
      }
    }
  }
})

export const userVar = makeVar();