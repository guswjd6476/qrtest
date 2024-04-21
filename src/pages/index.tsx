import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    // Function to navigate to the student page
    const goToStudentPage = () => {
        router.push('/Student'); // Replace '/student' with the actual path to the student page
    };

    // Function to navigate to the admin page
    const goToAdminPage = () => {
        router.push('/Admin'); // Replace '/admin' with the actual path to the admin page
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-8">아이엠 21기</h1>
            <div className="flex flex-col space-y-4">
                <button
                    onClick={goToStudentPage}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    학생
                </button>
                <button
                    onClick={goToAdminPage}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    코치
                </button>
            </div>
        </div>
    );
}
