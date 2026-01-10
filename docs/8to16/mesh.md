# Mesh

Mesh lets you communicate with other projects running in the same browser or in TurboWarp Desktop, using a special type of message called a mesh.

## Setup

To setup a connection between a project, create a mesh in one project, and then create another mesh with the same name in another project.

## Blocks

```scratch
broadcast mesh (mesh name v) :: #00acff
```
This block sends a mesh to all other projects that have the extension running. It triggers the hat block below in projects that listen for the mesh.

```scratch
when I receive mesh [mesh name v] :: #00acff hat
```
This block will activate when another project sends *this* project a mesh with the same name. It is triggered using the block above in any other project.

> [!IMPORTANT]
> Projects cannot access variables or lists stored in each other, even if they have the same name and they are being used in a mesh.