{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Your existing packages
    nodejs
    firebase-tools
    google-cloud-sdk
    sudo  # Add this line
    # Other development tools
  ];
}
