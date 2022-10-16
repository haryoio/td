import { Todo, User } from "@prisma/client";
import { useState } from "react";
import { ProfileImage } from "../components/atoms/ProfileImage";
import { trpc } from "../utils/trpc"
import { useCallback } from "react"

export const GlobalTask = () => {
    const [page, setPage] = useState<number>(1)
    const alltodo = trpc.todo.global.useQuery({
        page: page,
        take: 10
    })

    const handleNextPage = useCallback(async () => {
        setPage(page >= 1 ? page - 1 : page)
        alltodo.refetch()
    }, [page, alltodo])
    const handlePrevPage = useCallback(async () => {
        setPage(page <= (alltodo.data?.lastPage || 0) ? page : page + 1)
        alltodo.refetch()
    }, [page, alltodo])

    return (
        <div className="flex flex-col  p-4 py-6 bg-slate-100 rounded-lg shadow-lg">
            {alltodo.data && (
                <TodoList todolist={alltodo.data.data} page={page} />
            )}
            <div className="flex justify-between mt-6">
                <button className="px-4 py-2 border-4 rounded-lg" onClick={() => handlePrevPage()}>{"<"}</button>
                <button className="px-4 py-2 border-4 rounded-lg" onClick={() => handleNextPage()}>{">"}</button>
            </div>
        </div>
    )
}
interface TodoListProps {
    todolist?: (Todo & {
        user: User;
    })[],
    filterCb?: (todo: Todo) => boolean,
    page: number
}

export const TodoList = ({ todolist, filterCb = () => true, page }: TodoListProps) => {
    if (!todolist) return <></>
    return <div>
        {todolist.filter(filterCb).map(todo => <Item  {...todo} page={page} key={todo.id} />)}
    </div>
}

const Item = (props: (Todo & {
    user: User;
    page: number
})) => {
    return (
        <div>
            <div className="flex justify-between border-b-2 w-full mt-4">
                <div className="flex">
                    <ProfileImage src={props.user.image || ""} w={5} h={5} />
                    <div className="flex">
                        <TodoToggle {...props} />
                        {props.completed ?
                            <s>{props.content}</s> :
                            <div>{props.content}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

const TodoToggle = (props: (Todo & {
    user: User;
    page: number
})) => {
    const toggle = trpc.todo.toggle.useMutation();
    const todolist = trpc.todo.global.useQuery({
        page: props.page,
        take: 10
    })

    const onToggleTodo = useCallback((todoId: string, completed: boolean) => {
        toggle.mutate({ todoId, completed }, {
            onSuccess: () => {
                todolist.refetch();
            }
        })
    }, [toggle, todolist])

    return (
        <input type="checkbox" className="mb-1 mx-2" onChange={() => onToggleTodo(props.id, props.completed)} checked={props.completed} defaultChecked={false} />
    )
}

// const RemoveButton = (props: Todo) => {
//     const remove = trpc.todo.remove.useMutation();
//     const todolist = trpc.todo.global.useQuery({})

//     const onRemoveTodo = useCallback(async (todoId: string) => {
//         await remove.mutate({ todoId }, {
//             onSuccess: () => {
//                 todolist.refetch();
//             }
//         })
//     }, [remove, todolist])

//     return <button className="relative px-3 w-flex h-full" onClick={() => onRemoveTodo(props.id)}>
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-red-400">
//             <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
//         </svg>

//     </button>
// }
