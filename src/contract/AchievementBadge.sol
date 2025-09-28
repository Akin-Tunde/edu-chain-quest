// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract AchievementBadge is Initializable, ERC721Upgradeable, AccessControlUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Badge {
        string name;
        string metadataURI;
        bool isSoulbound;
    }
    
    mapping(uint256 => Badge) public badges;
    CountersUpgradeable.Counter private _tokenIds;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin, address _minter) public initializer {
        __ERC721_init("EduChain Achievement Badge", "EDUA");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _minter);
    }

    function createBadge(string memory _name, string memory _metadataURI, bool _isSoulbound) external onlyRole(ADMIN_ROLE) returns (uint256) {
        _tokenIds.increment();
        uint256 badgeId = _tokenIds.current();
        badges[badgeId] = Badge({ name: _name, metadataURI: _metadataURI, isSoulbound: _isSoulbound });
        return badgeId;
    }

    function mintBadge(address recipient, uint256 badgeId) external onlyRole(MINTER_ROLE) {
        require(bytes(badges[badgeId].name).length > 0, "Badge does not exist");
        _safeMint(recipient, badgeId);
    }
    
    // FIX: Changed 'view' to 'pure' to resolve the compiler warning.
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI(), badges[tokenId].metadataURI));
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Upgradeable)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (badges[tokenId].isSoulbound) {
            require(from == address(0), "Soulbound token cannot be transferred");
        }
        return super._update(to, tokenId, auth);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
