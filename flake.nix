{
  description = "devalut-frontend";

  inputs.utils.uri = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShell = import ./shell.nix { inherit pkgs; };
      }
    );
}
