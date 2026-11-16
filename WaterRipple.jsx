// Riak (tiga gelang yang membesar perlahan dan pudar) atau percikan lembut. x,y dalam %.
export default function WaterRipple({ x, y, kind = "ripple" }) {
  return (
    <div className={"ripple " + kind} style={{ left: x + "%", top: y + "%" }}>
      {kind === "splash" && [0, 1, 2, 3, 4, 5].map((i) => <b key={i} style={{ "--a": -70 + i * 28 + "deg" }} />)}
      <i /><i style={{ animationDelay: ".35s" }} /><i style={{ animationDelay: ".7s" }} />
    </div>
  );
}
