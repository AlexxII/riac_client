import React, { Fragment } from 'react'

const LinearTable = ({ index, question }) => {
  return (
    <Fragment>
      <div className="linear-table">
        <table >
          <tr>
            <th>&nbsp;</th><th>Ответов</th><th>%</th>
          </tr>
          <tr>
            <td className="question-title" colspan="3"><strong>{index + 1}. {question.title}</strong></td>
          </tr>
          {question.answers.map((answer, index) =>
            <tr>
              <td className="answer-title">
                <strong>{index + 1}</strong>. - <strong>{answer.code}</strong> {answer.title}</td><td>{answer.results.length}</td>
              <td>-</td>
            </tr>
          )}
        </table>
      </div>
    </Fragment>
  )
}

export default LinearTable