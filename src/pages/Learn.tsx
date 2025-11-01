import SimpleSilk from "../components/SimpleSilk";

const Learn: React.FC = () => {
  return (
    <div className="relative min-h-screen pt-20">
      <SimpleSilk />
      <div className="relative z-10 px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">Learn</h1>
        <p className="mb-4 text-white/80">Welcome to the Learn page!</p>
      </div>
    </div>
  );
};

export default Learn;
