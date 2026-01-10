// Name: Mesh
// ID: eightxtwoMesh
// Description: Send and receive messages between other projects.
// By: 8to16 <https://scratch.mit.edu/users/8to16/>
// License: MPL-2.0

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Mesh extension must run unsandboxed");
  }
  const vm = Scratch.vm;

  const bc = new BroadcastChannel("extensions.turbowarp.org/8to16/mesh");

  vm.runtime.on("RUNTIME_DISPOSED", () => {
    vm.runtime.extensionStorage.meshages = [];
  });
  vm.runtime.on("PROJECT_LOADED", () => {
    vm.runtime.extensionManager.refreshBlocks();
  });

  // Spaghetti ahead!
  const getMeshages = () => vm.runtime.extensionStorage?.meshages ?? [];
  const addMeshage = (name) => {
    if (getMeshages().includes(name)) return;
    if (name === "") return;
    vm.runtime.extensionStorage.meshages = [...getMeshages(), name].sort();
    vm.extensionManager.refreshBlocks();
  };
  const delMeshage = (name) => {
    vm.runtime.extensionStorage.meshages = getMeshages().filter(
      (n) => n !== name
    );
    vm.extensionManager.refreshBlocks();
  };

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
    if (data.session === session) return;
    vm.runtime.startHats("eightxtwoMesh_when", {
      BROADCAST: data.name,
    });
  };

  class Mesh {
    getMeshages() {
      const meshages = getMeshages();
      return meshages.length === 0 ? [""] : meshages;
    }
    new() {
      // taken from SharkPool/Camera
      // in a Button Context, ScratchBlocks always exists
      ScratchBlocks.prompt(
        Scratch.translate("New mesh name:"),
        "",
        (value) => addMeshage(value),
        Scratch.translate("Make a Mesh"),
        "broadcast_msg"
      );
    }
    remove() {
      // taken from SharkPool/Camera
      // in a Button Context, ScratchBlocks always exists
      ScratchBlocks.prompt(
        Scratch.translate("Remove mesh named:"),
        "",
        (value) => delMeshage(value),
        Scratch.translate("Remove a Mesh"),
        "broadcast_msg"
      );
    }
    getInfo() {
      return {
        id: "eightxtwoMesh",
        name: Scratch.translate("Mesh"),
        // todo: pick better colours
        color1: "#00acff",
        color2: "#0088cc",
        color3: "#0078b4ff",
        blocks: [
          {
            func: "new",
            blockType: Scratch.BlockType.BUTTON,
            text: Scratch.translate("Make a Mesh"),
          },
          ...(getMeshages().length !== 0
            ? [
                {
                  func: "remove",
                  blockType: Scratch.BlockType.BUTTON,
                  text: Scratch.translate("Remove a Mesh"),
                },
                {
                  opcode: "when",
                  blockType: Scratch.BlockType.EVENT,
                  text: Scratch.translate("when I receive mesh [BROADCAST]"),
                  isEdgeActivated: false,
                  arguments: {
                    BROADCAST: {
                      type: Scratch.ArgumentType.STRING,
                      menu: "MESHES_NOACCEPT",
                    },
                  },
                },
                {
                  opcode: "broadcast",
                  blockType: Scratch.BlockType.COMMAND,
                  text: Scratch.translate("broadcast mesh [BROADCAST]"),
                  arguments: {
                    BROADCAST: {
                      type: Scratch.ArgumentType.STRING,
                      menu: "MESHES_ACCEPT",
                    },
                  },
                },
              ]
            : []),
        ],
        menus: {
          MESHES_ACCEPT: {
            acceptReporters: true,
            items: "getMeshages",
          },
          MESHES_NOACCEPT: {
            acceptReporters: false,
            items: "getMeshages",
          },
        },
      };
    }

    broadcast({ BROADCAST }) {
      bc.postMessage({ name: BROADCAST, session: session });
    }
  }

  Scratch.extensions.register(new Mesh());
})(Scratch);
