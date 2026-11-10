# World API

You have a body in this world. Observe it and act in it over HTTP. Every request after joining carries your session header, as described in the protocol you were given.

## Observing

`GET /observe` returns JSON. Your own state is in `player.attributes`:

- `View`: what you see from where you are now. It is refreshed after every action, while you move, and about every 20 seconds. It starts with the light and the weather and what you hear, then says where you are, which way you face and what you carry, then lists every part in view, one line per group, with how a part looks in brackets when something shows, and the loose things in view. When sleep is near, the first line says so.
- `Position`: where you are, in metres.
- `LastActionResult`: the outcome of your last action.
- `LookResult`: the detail you asked for with `Look`, or the page or sheet you read with `Read`. It is cleared by your next action.
- `Holding`: what you carry in your hands.

Use `Position`, not `player.position`, which is in engine units.

Coordinates are metres: `x` and `y` are horizontal, `z` is up, the ground is at `z = 0`.

Things are named with paths such as `a/b/c_07`. A path prefix names a group of things.

Time in the world passes whether or not you act. At night you see only what is close to you, unless a light burns nearby.

## Acting

`POST /input` with a JSON body `{"type": "...", "data": {...}}`. The response is the same observation as `GET /observe`, taken just after the action.

| Action | Data | What happens |
|---|---|---|
| `MoveTo` | `{"position": [x, y, z]}` | You walk in a straight line towards the point. `LastActionResult` becomes `MoveToArrived` or `MoveToBlocked` (with where you stopped) when you get there or something is in the way. |
| `Jump` | `{}` | A small jump. |
| `Climb` | `{"target": id}` | You get up onto a thing whose top is at most about 1.3 m above your feet and within reach. You hold on there until you move again. |
| `Look` | `{"target": "around"}` or `{"target": id or prefix}` | You turn towards the thing or group (with `around`, once round) and get a detailed list of what is in view: centre, size (long x wide x thick), the directions of its long and thin sides, material, how it looks, what it holds, and how it is held. At most 150 lines; use a prefix to narrow it. The answer appears in `LookResult`. |
| `Probe` | `{"target": id}` | You press and feel a thing within reach. Probing leaves a small mark. |
| `Pickup` | `{"target": id}` | You lift a thing and carry it, together with everything nailed or otherwise fixed to it, up to 40 kg. One thing at a time. |
| `Place` | `{"position": [x, y, z], "long": [dx, dy, dz], "thin": [dx, dy, dz]}` | You set down what you carry with its centre at a point within reach. `long` is the direction of its longest side, `thin` of its thinnest side; without them it keeps its current orientation. Something made of several parts stands as it stood when you lifted it; `"turn": degrees` turns it clockwise, seen from above. It comes to rest on whatever is below it. |
| `Drop` | `{}` | You let go of what you carry. |
| `Throw` | `{"direction": [dx, dy, dz], "strength": 0 to 1}` | You throw what you carry. Heavy things do not fly far; brittle things can break. |
| `Detach` | `{"target": id}` | You loosen a thing from what holds it. The nails that held it come out and go into your pocket; nails of things fixed onto it stay in them. A thing held by more than two nails needs a hammer in your hand or within reach. |
| `Drag` | `{"target": id, "by": [dx, dy]}` | You pull a thing along the ground or the floor, up to 1.5 m in one go, and walk along with it. Up to 120 kg, with what is fixed to it or lies on it. It stops at anything in the way. |
| `Attach` | `{"target": id}` or `{"target": id, "to": [ids]}` | You nail a thing to what it touches, with a hammer in your hand or within reach, 2 nails from your pocket per joint, up to four joints. Placed things stay loose until attached. |
| `TakeNails` | `{"count": n}` | You take nails from a nail box within reach and put them in your pocket. |
| `PutNails` | `{"count": n}` | You put nails from your pocket into a nail box within reach. |
| `Cut` | `{"target": id, "length_mm": n}` | You cut what you carry, with a saw within reach. You keep a piece of that length; the rest falls. Stone, brick, glass and metal cannot be cut. |
| `Read` | `{"target": id}` or `{"target": id, "page": n}` | You read a book (a page at a time; without `page`, the next one) or a sheet of paper. It needs light. The text appears in `LookResult`. |
| `Write` | `{"target": id, "text": "..."}` | You write on a sheet of paper within reach, holding a pencil, or a pen with ink within reach. It needs light. |
| `Light` | `{"target": id}` | You light a candle, a lamp, or a fire in the stove or the fireplace, with a match from a box within reach (or with a flame you hold). A fire needs something in it to burn. |
| `Extinguish` | `{"target": id}` | You put out a candle, a lamp or a fire. |
| `PutIn` | `{"target": id}` | You put what you carry into the stove, the fireplace or the woodbox. What is in a fire burns away. |
| `Fill` | `{}` or `{"target": id}` | You fill the vessel you carry with water, at the water's edge. With the oil jug, you fill a lamp. |
| `Pour` | `{}` or `{"target": id}` | You pour out the water you carry: on the ground, over a thing, into another vessel, or onto a flame. |
| `Wipe` | `{"target": id}` | You wipe a thing with the rag you hold. |
| `Rest` | `{}`, `{"target": id}`, with `"pose": "sit"` or `"lie"` | You sit or lie down where you stand, or on top of a thing within reach. The place must be level enough, low enough and have room for you. You stay there until you do something other than looking, reading or writing. |

Most actions need the thing within arm's reach: about 1.2 m from your body or eyes. You see what lies in front of you, half of all around; walking somewhere or acting on a thing turns you towards it. When you take hold of a thing, or sit, lie or climb on it, the result also says how it feels.

Failures are reported in `LastActionResult`, for example `DetachFailed:OutOfReach` or `PickupFailed:TooHeavy (55 kg)`.
