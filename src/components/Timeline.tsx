import { useState, useCallback } from "react";
import { ProfileImage } from "../components/atoms/ProfileImage";
import { trpc } from "../utils/trpc"

export const TimeLine = () => {
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
        <div className="flex flex-col  p-4 py-6 bg-slate-100 rounded-lg shadow-lg overflow-scroll-y max-h-80vw">
            {alltodo.data && (
                alltodo.data.data.filter(todo => todo.completed).map(todo => (
                    <div key={todo.id} className="flex my-3">
                        <ProfileImage src={todo.user.image || ""} />
                        <div className="flex flex-col  mx-3">
                            {
                                todo.user.name === todo.user.name ?
                                    <div>{todo.user.name}はタスクを完了しました。</div> :
                                    <div>{todo.doneUser} によって{todo.user.name}のタスクを完了されました。</div>
                            }
                            <div>完了日時：{todo.doneAt?.toLocaleString('ja-JP')}</div>
                        </div>
                    </div>
                ))
            )}
            <div className="flex justify-between mt-6">
                <button className="px-4 py-2 border-4 rounded-lg" onClick={() => handlePrevPage()}>{"<"}</button>
                <button className="px-4 py-2 border-4 rounded-lg" onClick={() => handleNextPage()}>{">"}</button>
            </div>
        </div>
    )
}
