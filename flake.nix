{
  description = "Web development environment";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs # Can be changed to nodejs_20 or different if needed
        nodePackages.typescript
        nodePackages.typescript-language-server
      ];
    };
  };
}
