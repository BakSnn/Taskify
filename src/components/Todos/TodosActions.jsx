import Button from '../UI/Button/Button'
import { RiDeleteBin2Line, RiRefreshLine } from 'react-icons/ri'

function TodosActions({
  todos,
  resetTodos,
  deleteCompletedTodos,
  completedTodosCount,
}) {
  return (
    !!todos.length && (
      <>
        <Button
          title={'Reset Todos'}
          children={RiRefreshLine()}
          onClick={resetTodos}
        ></Button>
        <Button
          title={'Delete Completed Todos'}
          children={RiDeleteBin2Line()}
          onClick={deleteCompletedTodos}
          disabled={!completedTodosCount}
        ></Button>
      </>
    )
  )
}

export default TodosActions
