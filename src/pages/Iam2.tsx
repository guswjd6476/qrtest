import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface PuzzlePieceProps {
    filled: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ filled }) => {
    return <div className={`relative w-20 h-20 border rounded-md ${filled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>;
};

interface StudentData {
    id: number;
    date: string;
    name: string;
    indexnum: number;
}

const Iam: React.FC = () => {
    const router = useRouter();
    const { date } = router.query;

    const [attendance, setAttendance] = useState<boolean[][]>([]);
    const [name, setName] = useState<string>('');
    const [uidList, setUidList] = useState<any>(null);
    const [showAttendance, setShowAttendance] = useState<boolean>(false);
    const [stepResult, setStepResult] = useState<StudentData[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [quote, setQuote] = useState<{ text: string; author: string }>({
        text: '',
        author: '',
    });

    const goToHome = () => {
        router.push('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/selectUid');
                if (response.status === 200) {
                    const result = response.data;
                    setUidList(result.find((value: any) => value.uid === date));
                } else {
                    console.error('서버 오류:', response.status);
                    alert('오류발생 server');
                }
            } catch (error) {
                console.error('오류 발생:', error);
                alert('오류발생 fetch');
            }
        };
        fetchData();
    }, [date]);

    useEffect(() => {
        const quotes = [
            { text: '끈기는 결국 성공을 가져온다.', author: '알버트 아인슈타인' },
            { text: '자신의 한계를 극복할 때, 우리는 성장한다.', author: '조지프 캠벨' },
            { text: '시작이 반이다. 꾸준함이 나머지 반이다.', author: '플라톤' },
            { text: '어떤 일이든 끈기를 가지면 끝을 볼 수 있다.', author: '칼릴 지브란' },
            { text: '끈기는 운명을 이긴다.', author: '나폴레옹 보나파르트' },
            { text: '포기하지 않으면 언젠가는 성공한다.', author: '윌리엄 셰익스피어' },
            { text: '힘들 때일수록 더 많은 인내가 필요하다.', author: '헬렌 켈러' },
            { text: '결국 끈기가 승리한다.', author: '빈센트 반 고흐' },
            { text: '최고의 성공은 실패를 극복한 후 얻어진다.', author: '윈스턴 처칠' },
            { text: '끈기 있는 자만이 목표를 이룬다.', author: '조지 워싱턴' },
            { text: '오늘의 노력은 내일의 결과로 돌아온다.', author: '벤자민 프랭클린' },
            { text: '계속해서 나아가는 것이 중요한 일이다.', author: '윈스턴 처칠' },
            { text: '성공은 끈기와 인내의 결과이다.', author: '톰 랜디' },
            { text: '모든 것을 할 수 없지만, 계속 할 수는 있다.', author: '로버트 F. 케네디' },
            { text: '꾸준한 노력은 반드시 빛을 본다.', author: '루이 파스퇴르' },
            { text: '시작을 했으면 끝까지 가야 한다.', author: '아르놀드 슈워제네거' },
            { text: '꾸준히 한다면 어떤 일이든 이룰 수 있다.', author: '리차드 브랜슨' },
            { text: '인내는 결국 승리를 이끈다.', author: '헨리 포드' },
            { text: '끈기와 인내는 성공을 위한 열쇠이다.', author: '칼 마르크스' },
            { text: '승자는 포기하지 않으며, 패자는 포기한다.', author: '로버트 T. 키요사키' },
            { text: '도전하는 사람만이 진정한 성취를 경험한다.', author: '마틴 루터 킹' },
            { text: '매일 조금씩 더 나아진다.', author: '브루스 리' },
            { text: '나는 실패하지 않는다. 나는 단지 방법을 10,000가지 발견했을 뿐이다.', author: '토마스 에디슨' },
            { text: '성공은 끈기 있는 자에게만 주어진다.', author: '베토벤' },
            { text: '끈기 있는 사람만이 꿈을 이룬다.', author: '아이작 뉴턴' },
            { text: '결단력 있게 밀고 나가라.', author: '스티브 잡스' },
            { text: '당신이 원하는 것을 얻을 때까지 계속하세요.', author: '파블로 피카소' },
            { text: '계속 나아가면 결국 길이 열린다.', author: '마하트마 간디' },
            { text: '불가능은 없다.', author: '무하마드 알리' },
            { text: '끈기와 인내는 모든 것을 극복할 수 있다.', author: '닐 암스트롱' },
            { text: '삶에서 끈기는 가장 큰 힘이다.', author: '헬렌 켈러' },
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    const handleButtonClick = async () => {
        if (!name.trim()) {
            console.error('이름을 입력해주세요.');
            return;
        }

        if (isSubmitting) {
            alert('?');
            return;
        }

        setIsSubmitting(true);

        try {
            if (!uidList) {
                console.error('uidList가 유효하지 않습니다.');
                alert('uidList가 유효하지 않습니다.');
                return;
            }

            const uid = uidList.indexnum;
            const response = await axios.post('/api/addName2', { name, uid });

            if (response.status === 200) {
                const result: StudentData[] = response.data;
                const uniqueData: StudentData[] = Object.values(
                    result.reduce((acc, item) => {
                        acc[item.indexnum] = item;
                        return acc;
                    }, {} as { [key: number]: StudentData })
                );
                setStepResult(uniqueData);
                setAttendance(generatePuzzle(uniqueData));
                setShowAttendance(true);
            } else {
                alert('서버 오류');
            }
        } catch (error) {
            console.error('오류 발생:', error);
            alert('오류발생');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generatePuzzle = (result: StudentData[]): boolean[][] => {
        const attendanceArray: boolean[][] = [];

        for (let i = 0; i < 4; i++) {
            attendanceArray.push(new Array(5).fill(false));
        }

        result.forEach((data) => {
            const index = data.indexnum - 1; // 0-based index
            if (index >= 0 && index < 20) {
                const row = Math.floor(index / 5); // 5 columns
                const col = index % 5;
                attendanceArray[row][col] = true;
            }
        });

        return attendanceArray;
    };

    return (
        <div
            style={{
                backgroundImage: 'url("/main.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'top',
            }}
            className="min-h-screen p-4 sm:p-8 flex justify-center items-center"
        >
            <div className="bg-white bg-opacity-80 rounded-xl shadow-xl p-6 w-full sm:w-96 md:w-96 lg:w-96 xl:w-1/3">
                {!showAttendance ? (
                    <div>
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">이름을 입력해주세요</h2>
                        <label className="block mb-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="이름"
                            />
                        </label>
                        <button
                            onClick={handleButtonClick}
                            disabled={isSubmitting || !uidList}
                            className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 shadow-md ${
                                isSubmitting || !uidList
                                    ? 'bg-yellow-400 cursor-not-allowed text-gray-800'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? '제출중...' : '제출'}
                        </button>
                        {(isSubmitting || !uidList) && (
                            <div className="text-sm text-yellow-600 bg-yellow-100 px-3 py-2 rounded-md shadow-sm">
                                ⚠️ 버튼이 노란색이면 새로고침을 해주세요
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            {attendance.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex justify-center"
                                >
                                    {row.map((filled, colIndex) => (
                                        <PuzzlePiece
                                            key={`${rowIndex}-${colIndex}`}
                                            filled={filled}
                                        />
                                    ))}
                                </div>
                            ))}
                            <div className="mt-4 text-center text-gray-600">
                                <p className="text-lg">{quote.text}</p>
                                <p className="mt-2 text-sm">- {quote.author}</p>
                            </div>
                        </div>

                        {stepResult.length >= 16 && (
                            <div className="text-center">
                                <div className="w-44 h-44 mx-auto mb-4">
                                    <Image
                                        className="object-cover w-full h-full rounded-md"
                                        src="/whoiam.jpg"
                                        alt="축하 이미지"
                                        width={176}
                                        height={176}
                                    />
                                </div>
                                <p className="text-xl font-semibold text-blue-600">당신은 {name}입니다</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Iam;
