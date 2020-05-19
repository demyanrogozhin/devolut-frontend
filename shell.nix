{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
  buildInputs = [
    nodejs-12_x  nodePackages_12_x.node-gyp
  ] ++ (with nodePackages; [
    yarn
    javascript-typescript-langserver
    create-react-app
  ]);

  shellHook = ''
    # ...
  '';
}
