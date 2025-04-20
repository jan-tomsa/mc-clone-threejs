import { describe, it } from 'mocha';
import { expect } from 'chai';
import { computeFacing } from '../src/utils/CoordinatesDisplay.js';

// Unit tests for the computeFacing function
describe('computeFacing', () => {
    it('should return "north" for a direction of 0 degrees', () => {
        expect(computeFacing(0)).to.equal('north');
    });

    it('should return "east" for a direction of 90 degrees', () => {
        expect(computeFacing(Math.PI / 2)).to.equal('east');
    });

    it('should return "south" for a direction of 180 degrees', () => {
        expect(computeFacing(Math.PI)).to.equal('south');
    });

    it('should return "west" for a direction of 270 degrees', () => {
        expect(computeFacing((3 * Math.PI) / 2)).to.equal('west');
    });
});