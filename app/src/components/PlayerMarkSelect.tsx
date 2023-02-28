function Radio({
  value,
  label,
  checked,
  onCheck,
}: {
  value: string;
  label: string;
  checked: boolean;
  onCheck: () => void;
}) {
  return (
    <label
      className={[
        "flex-1   py-3 inline-block px-4 hover:cursor-pointer overflow-hidden rounded-lg",
        checked ? "bg-gray-300 text-gray-900" : "",
      ].join(" ")}
    >
      <span className="text-xl font-bold">{label}</span>
      <input
        type="radio"
        value={value}
        name="mark"
        className="hidden"
        checked={checked}
        onChange={() => onCheck()}
      />

      <style jsx>{`
        span {
          z-index: -1;
        }
      `}</style>
    </label>
  );
}

export function PlayerMarkSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="text-gray-200 py-6 px-4 rounded-lg max-w-sm mx-auto bg-gray-800 shadow-lg">
      <p className="mb-6 font-medium text-xl">Pick your mark</p>
      <div className="flex bg-gray-900 py-2 px-2 rounded-lg">
        <Radio
          label="X"
          value="x"
          checked={value === "x"}
          onCheck={() => onChange("x")}
        />
        <Radio
          label="O"
          value="o"
          checked={value === "o"}
          onCheck={() => onChange("o")}
        />
      </div>
    </div>
  );
}
