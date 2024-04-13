interface QRCodeInputProps {
    value: string;
    onChange: (value: string) => void;
}

const QRCodeInput = ({ value, onChange }: QRCodeInputProps) => {
    return (
        <input
            type="text"
            value={value}
            className="border w-full md:w-3/4 mx-auto px-4 rounded-lg text-lg mt-4"
            placeholder="Enter Text"
            onChange={(e) => onChange(e.target.value)}
            autoFocus
        />
    );
};

export default QRCodeInput;
