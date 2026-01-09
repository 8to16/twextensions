// Name: Mesh
// ID: eightxtwoMesh
// Description: Communicate with other projects, without the need for a network.
// By: 8to16 <https://scratch.mit.edu/users/8to16/>
// License: MPL-2.0

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Mesh extension must run unsandboxed");
  }

  const bc = new BroadcastChannel("extensions.turbowarp.org/8to16/mesh");

  // taken from local-storage
  const session = (() => {
    // doesn't need to be cryptographically secure and doesn't need to have excessive length
    // this has 16^16 = 18446744073709551616 possible session IDs which is plenty
    const soup = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < 16; i++) {
      id += soup[Math.floor(Math.random() * soup.length)];
    }
    return id;
  })();

  bc.onmessage = ({ data }) => {
    console.log(data);
    if (data.session === session) {
      console.log("Hi");
      return;
    }
    Scratch.vm.runtime.startHats("eightxtwoMesh_when", {
      BROADCAST: data.name,
    });
  };

  class Mesh {
    getInfo() {
      return {
        id: "eightxtwoMesh",
        name: Scratch.translate("Mesh"),
        blocks: [
          {
            opcode: "broadcast",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("broadcast [BROADCAST]"),
            arguments: {
              BROADCAST: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "dango clicked",
              },
            },
          },
          {
            opcode: "when",
            blockType: Scratch.BlockType.EVENT,
            text: Scratch.translate("when I receive [BROADCAST]"),
            isEdgeActivated: false,
            arguments: {
              BROADCAST: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "dango clicked",
              },
            },
          },
        ],
      };
    }

    broadcast({ BROADCAST }) {
      bc.postMessage({ name: BROADCAST, session: session });
    }
  }

  Scratch.extensions.register(new Mesh());
})(Scratch);
