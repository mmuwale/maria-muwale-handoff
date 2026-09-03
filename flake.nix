{
  description = "maria-app - Maria Muwale campaign site (Next.js + Drizzle + tRPC)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            nodejs_22
            python3
            sqlite
            gnumake
            gcc
          ];

          shellHook = ''
            export NODE_ENV=development
            echo "maria-app dev shell: bun $(bun --version), node $(node --version)"
          '';
        };
      });
}
