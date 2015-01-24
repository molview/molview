/**
 * This file is part of MolView (http://molview.org)
 * Copyright (c) 2014, 2015 Herman Bergwerf
 *
 * MolView is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MolView is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with MolView.  If not, see <http://www.gnu.org/licenses/>.
 */

function MPLine(obj)
{
    this.from = obj !== undefined ? obj.from.clone() || new MPPoint() : new MPPoint();
    this.to = obj !== undefined ? obj.to.clone() || new MPPoint() : new MPPoint();
}

/* function lineLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    return {
        x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / div,
        y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / div
    };
} */

MPLine.prototype.intersection = function(line)
{
    var denominator = ((line.to.y - line.from.y) * (this.to.x - this.from.x))
                    - ((line.to.x - line.from.x) * (this.to.y - this.from.y));

    if(denominator === 0)
    {
        return {
            p: undefined,
            onL1: false,
            onL2: false
        };
    }

    var a = this.from.y - line.from.y;
    var b = this.from.x - line.from.x;
    var numerator1 = ((line.to.x - line.from.x) * a) - ((line.to.y - line.from.y) * b);
    var numerator2 = ((this.to.x - this.from.x) * a) - ((this.to.y - this.from.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    return {
        p: MPPFO({
            x: this.from.x + (a * (this.to.x - this.from.x)),
            y: this.from.y + (a * (this.to.y - this.from.y))
        }),
        //if line2 is a segment and line1 is infinite, they intersect if
        onL1: a > 0 && a < 1,
        //if line2 is a segment and line1 is infinite, they intersect if:
        onL2: b > 0 && b < 1
    };
}

MPLine.prototype.length = function()
{
    return this.from.distanceTo(this.to);
}
