import HistoryList from "../../components/History/HistoryList"

const HistoryPage = () => {
    return (
        <>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">
                    Your Config Histories
                </h1>
                <HistoryList />
            </div>
        </>
    )
}

export default HistoryPage