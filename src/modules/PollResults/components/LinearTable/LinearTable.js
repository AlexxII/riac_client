import React, { Fragment, useState } from 'react'

const LinearTable = ({ question }) => {
  const [count] = useState(
    question.answers.reduce((acum, curr) => {
      return acum + curr.results.length
    }, 0)
  )

  return (
    <Fragment>
      <div className="linear-table">
        <table >
          <tr>
            <th>&nbsp;</th><th>Ответов</th><th>%</th>
          </tr>
          {question.answers.map((answer, index) =>
            <tr>
              <td className="answer-title">
                <strong>{index + 1}</strong>. - <strong>{answer.code}</strong> {answer.title}</td><td>{answer.results.length}</td>
              <td>
                {count ?
                  (answer.results.length / count * 100).toFixed(1) :
                  '-'
                }
              </td>
            </tr>
          )}
        </table>
      </div>
    </Fragment>
  )
}

export default LinearTable