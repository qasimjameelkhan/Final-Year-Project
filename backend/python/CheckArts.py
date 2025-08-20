import os
import sys
import json
from typing import Tuple, List
import logging
from PIL import Image
import imagehash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ArtChecker:
    def __init__(self, art_path: str):
        """
        Initialize the ArtChecker with the path to the art/image file.
        
        Args:
            art_path (str): Path to the art/image file
        """
        self.art_path = art_path
        self.image = None
        self.hash = None
        
        if not os.path.exists(art_path):
            raise FileNotFoundError(f"Art file not found at {art_path}")
            
        try:
            self.image = Image.open(art_path)
            self.hash = self._calculate_hash()
        except Exception as e:
            logger.error(f"Error processing art file: {str(e)}")
            raise

    def _calculate_hash(self) -> str:
        """
        Calculate perceptual hash of the image.
        
        Returns:
            str: Hash value of the image
        """
        try:
            # Convert to grayscale for better hash calculation
            gray_image = self.image.convert('L')
            # Calculate average hash
            hash_value = str(imagehash.average_hash(gray_image))
            return hash_value
        except Exception as e:
            logger.error(f"Error calculating hash: {str(e)}")
            raise

    def check_duplicate(self, existing_arts: List[str], threshold: float = 0.9) -> Tuple[bool, str]:
        """
        Check if the art is a duplicate of any existing art.
        
        Args:
            existing_arts (List[str]): List of paths to existing art files
            threshold (float): Similarity threshold (0-1)
            
        Returns:
            Tuple[bool, str]: (is_duplicate, message)
        """
        if not self.hash:
            return False, "Could not calculate hash for the art"
            
        for existing_art in existing_arts:
            try:
                existing_image = Image.open(existing_art)
                existing_hash = str(imagehash.average_hash(existing_image.convert('L')))
                
                # Calculate similarity between hashes
                similarity = self._calculate_similarity(self.hash, existing_hash)
                
                if similarity >= threshold:
                    return True, f"Art is similar to existing art: {existing_art}"
                    
            except Exception as e:
                logger.error(f"Error comparing with {existing_art}: {str(e)}")
                continue
                
        return False, "No duplicates found"

    def _calculate_similarity(self, hash1: str, hash2: str) -> float:
        """
        Calculate similarity between two hash values.
        
        Args:
            hash1 (str): First hash value
            hash2 (str): Second hash value
            
        Returns:
            float: Similarity score (0-1)
        """
        # Convert hex hashes to binary
        hash1_bin = bin(int(hash1, 16))[2:].zfill(64)
        hash2_bin = bin(int(hash2, 16))[2:].zfill(64)
        
        # Calculate Hamming distance
        distance = sum(c1 != c2 for c1, c2 in zip(hash1_bin, hash2_bin))
        
        # Convert to similarity score (0-1)
        similarity = 1 - (distance / 64)
        return similarity

    def get_art_info(self) -> dict:
        """
        Get information about the art file.
        
        Returns:
            dict: Art information
        """
        try:
            return {
                "path": self.art_path,
                "size": os.path.getsize(self.art_path),
                "dimensions": self.image.size,
                "format": self.image.format,
                "hash": self.hash
            }
        except Exception as e:
            logger.error(f"Error getting art info: {str(e)}")
            raise

def check_art_duplicate(art_path: str, existing_arts: List[str], threshold: float = 0.9) -> Tuple[bool, str]:
    """
    Check if an art file is a duplicate of any existing art.
    
    Args:
        art_path (str): Path to the art file to check
        existing_arts (List[str]): List of paths to existing art files
        threshold (float): Similarity threshold (0-1)
        
    Returns:
        Tuple[bool, str]: (is_duplicate, message)
    """
    try:
        checker = ArtChecker(art_path)
        return checker.check_duplicate(existing_arts, threshold)
    except Exception as e:
        logger.error(f"Error in art duplicate check: {str(e)}")
        return False, str(e)

def main():
    """
    Main function to handle command line arguments and check for art duplication.
    Expected arguments:
    1. Path to the art file to check
    2. Comma-separated list of paths to existing art files
    """
    if len(sys.argv) != 3:
        result = {
            "isDuplicate": False,
            "message": "Invalid number of arguments"
        }
        print(json.dumps(result))
        sys.exit(1)

    art_path = sys.argv[1]
    existing_arts = sys.argv[2].split(',') if sys.argv[2] else []

    try:
        is_duplicate, message = check_art_duplicate(art_path, existing_arts)
        result = {
            "isDuplicate": is_duplicate,
            "message": message
        }
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        result = {
            "isDuplicate": False,
            "message": f"Error checking duplication: {str(e)}"
        }
        print(json.dumps(result))
        sys.exit(1)

if __name__ == "__main__":
    main() 