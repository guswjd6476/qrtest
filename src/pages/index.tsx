import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-cover bg-top"
            style={{ backgroundImage: "url('/main.png')" }}
        >
            <div className="flex flex-col space-y-6">
                <button
                    onClick={() => router.push('/Student4')}
                    className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
                >
                    내 출석 확인
                </button>
                <button
                    onClick={() => router.push('/Admin')}
                    className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-all"
                >
                    코치 페이지
                </button>
            </div>
        </div>
    );
}
