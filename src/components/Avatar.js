export const Avatar = ({ name, size }) => {
    return (
        <div className="d-flex align-items-center" style={{ width: size }}>
            <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${name}`} alt="" />
        </div>
    );
};
