import { Todo } from "@prisma/client";
import { SetStateAction, useCallback, useState, Dispatch, Fragment } from "react";
import { trpc } from "../utils/trpc";
import { Dialog, Transition } from "@headlessui/react"


export const TodoList = () => {
    const todolist = trpc.todo.getAll.useQuery()
    let [isOpen, setIsOpen] = useState(false)

    if (todolist.isLoading) {
        return <div>Loading...</div>
    }

    return (<>
        <div className="flex flex-col mx-10 my-4">
            <NewTodoForm isOpen={isOpen} setIsOpen={setIsOpen} />
            <div>
                <button onClick={() => setIsOpen(!isOpen)} className="pb-1 py-2 px-4 bg-blue-300 from-gray-50 rounded-full flex">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    <div className="text-center ml-1">新規TODO</div>
                </button>
            </div>

            <div className="my-2" />
            <h2 className="font-black">未完了</h2>
            <hr />
            <div>
                {todolist.data?.filter(todo => !todo.completed).map(todo => <Item  {...todo} key={todo.id} />)}
            </div>
            <div className="my-2" />
            <div className="font-black font-9xl">完了</div>
            <div>
                {todolist.data?.filter(todo => todo.completed).map(todo => <Item  {...todo} key={todo.id} />)}
            </div>
        </div>
    </>
    )
}

const Item = (props: Todo) => {
    return <div className="flex justify-between border-b-2 w-full mt-4">
        <div className="flex ">
            <TodoToggle {...props} />
            {props.completed ?
                <s>{props.content}</s> :
                <div>{props.content}</div>}
        </div>
        <RemoveButton {...props} />
    </div>
}

const TodoToggle = (props: Todo) => {
    const toggle = trpc.todo.toggle.useMutation();
    const todolist = trpc.todo.getAll.useQuery()

    const onToggleTodo = useCallback(async (todoId: string, completed: boolean) => {
        await toggle.mutate({ todoId, completed }, {
            onSuccess: () => {
                todolist.refetch();
            }
        })
    }, [toggle])

    return (
        <input type="checkbox" className="mb-1 mx-2" onClick={() => onToggleTodo(props.id, props.completed)} checked={props.completed} />
    )
}

const RemoveButton = (props: Todo) => {
    const remove = trpc.todo.remove.useMutation();
    const todolist = trpc.todo.getAll.useQuery()

    const onRemoveTodo = useCallback(async (todoId: string) => {
        await remove.mutate({ todoId }, {
            onSuccess: () => {
                todolist.refetch();
            }
        })
    }, [remove])

    return <button className="relative px-3 w-flex h-full" onClick={() => onRemoveTodo(props.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 fill-red-400">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
        </svg>

    </button>
}

const NewTodoForm = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
    const [content, setContent] = useState<string>();
    const create = trpc.todo.add.useMutation();
    const show = trpc.todo.getAll.useQuery()

    const createTodo = useCallback(async () => {
        if (!content) return;

        await create.mutate({ content }, {
            onSuccess: () => {
                setContent("")
                show.refetch()
                setIsOpen(false)
            }
        })
    }, [content, show, create])

    return (
        <Transition
            show={isOpen}
            as={Fragment}
        >
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="absolute inset-0 w-full h-full backdrop-blur-sm" />
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-sm rounded bg-white p-8 shadow">
                            <Dialog.Title>新規TODO</Dialog.Title>
                            <Dialog.Description></Dialog.Description>
                            <form className="" onSubmit={(e) => {
                                e.preventDefault();
                                createTodo()
                            }} onKeyDown={({ key }) => {
                                if (key == "Enter") {
                                    createTodo();
                                }
                            }}>
                                <input value={content} onChange={(e) => {
                                    setContent(e.target.value)
                                }} type="text" id="content" name="content" className="relative rounded w-full border-2 p-1 focus:outline-none focus:shadow-outline" />
                                <div className="w-full pt-4 flex justify-between">
                                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                                    <button type="submit" onSubmit={(e) => {
                                        e.preventDefault()
                                        createTodo()
                                    }}>送信</button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition >
    )
}
