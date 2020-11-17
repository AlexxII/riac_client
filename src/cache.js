import { InMemoryCache } from '@apollo/client'

export const cache = new InMemoryCache({
  typePolicies: {
    Poll: {
      fields: {
        question: {
          read(question) {
            return question
          }
        }
      }
    }
  }
})