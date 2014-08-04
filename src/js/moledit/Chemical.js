/*===========================================================================*/
/*                     (c) Copyright 2014, MolSoft L.L.C.                    */
/*                          ALL RIGHTS RESERVED                              */
/*                               v. 1.2.4                                    */
/*===========================================================================*/

/*
Used and modified for MolView with permission from MolSoft L.L.C.
See: http://molview.org
*/

function Chemical()
{
    this.atoms = [];
    this.bonds = [];
    this.minx = 0;
    this.maxx = 1.2 * 6;
    this.miny = 0;
    this.maxy = 1.2 * 6;
    this.rings = [];
}

Chemical.prototype.processChemical = function ()
{
    this.calcConnectivity();
    this.assignHyb();
    this.findRings();
    this.assignCIP();
    this.assignChirality();
}

function bondKey(bo)
{
    return Math.min(bo.fr, bo.to).toString() + "x" + Math.max(bo.fr, bo.to).toString();
}

Chemical.prototype.centerPoint = function ()
{
    return {
        x: (this.minx + this.maxx) / 2,
        y: (this.miny + this.maxy) / 2,
        z: 0
    }
}

Chemical.prototype.calcConnectivity = function ()
{
    for(var i = 0; i < this.atoms.length; i++)
    {
        this.atoms[i].bo = [];
        this.atoms[i].ty = [];
        this.atoms[i].conn = 0;
        this.atoms[i].nHyd = 0;
        if(typeof this.atoms[i].qfm == "undefined") this.atoms[i].qfm = 0;
        if(typeof this.atoms[i].ms == "undefined") this.atoms[i].ms = 0;
    }

    for(var i = 0; i < this.bonds.length; i++)
    {
        var bo = this.bonds[i];
        if(typeof bo.ms == "undefined") bo.ms = 0;
        var ty = bo.ty;
        if(bo.ms & M_AR) ty |= 4;

        this.atoms[bo.fr].conn += bo.ty; //((ty&4)?1.5:ty);
        this.atoms[bo.to].conn += bo.ty; //((ty&4)?1.5:ty);

        ty |= (bo.ms & (M_RNG | M_BO_UP | M_BO_DW));
        this.atoms[bo.fr].bo.push(bo.to);
        this.atoms[bo.fr].ty.push(ty);
        this.atoms[bo.to].bo.push(bo.fr);
        this.atoms[bo.to].ty.push(ty);

        if(this.atoms[bo.fr].cd == 1) this.atoms[bo.to].nHyd++;
        if(this.atoms[bo.to].cd == 1) this.atoms[bo.fr].nHyd++;
    }

    this.calcBox();

    for(var i = 0; i < this.atoms.length; i++) this.atoms[i].conn = Math.floor(this.atoms[i].conn);
}

Chemical.prototype.calcBox = function ()
{
    this.minx = this.miny = Number.MAX_VALUE;
    this.maxx = this.maxy = -Number.MAX_VALUE;

    for(var i = 0; i < this.atoms.length; i++)
    {
        var at = this.atoms[i];
        this.minx = Math.min(at.x, this.minx);
        this.miny = Math.min(at.y, this.miny);
        this.maxx = Math.max(at.x, this.maxx);
        this.maxy = Math.max(at.y, this.maxy);
    }
}

Chemical.prototype.nbo_all = function (at)
{
    return at.bo.length + this.H(at) - at.nHyd;
}

Chemical.prototype.calc_qfm = function (at)
{
    var S = function (cd)
    {
        return(((cd) == 5) ? (-1) : 1);
    }
    var q = at.conn - this.V(at);
    return q >= 0 ? q * S(at.cd) : 0;
}

Chemical.prototype.get_qfm = function (at)
{
    return(at.ms & M_EXPLICT_QFM) ? at.qfm : this.calc_qfm(at);
}

Chemical.prototype.H = function (at)
{
    if(at.cd == 1) return 0;
    var v = this.V(at);
    if(v == 0) return 0;
    var h = v - at.conn + at.qfm + at.nHyd;
    return(h < 0) ? 0 : h;
}

Chemical.prototype.V = function (at)
{
    switch(at.cd)
    {
    case 8: // O
        return 2;
    case 7: // N
        return(at.conn <= 4) ? 3 : 5;
    case 5: // B
        return(at.conn <= 4) ? 3 : 5;
    case 6: // C
        return 4;
    case 34: // Se
    case 16: // S
        return(at.conn <= 3) ? 2 : (at.conn <= 5) ? 4 : 6;
    case 33: // As
    case 15: // P
        return(at.conn <= 4) ? 3 : (at.conn <= 6) ? 5 : 6;
    case 14: // Si
        return 4;
    case 17: // Cl
        return(at.conn <= 2) ? 1 : (at.conn <= 4) ? 3 : (at.conn <= 6) ? 5 : 7;
    case 9: // F
        return 1;
    case 35: // Br
        return(at.conn <= 2) ? 1 : (at.conn <= 4) ? 3 : (at.conn <= 6) ? 5 : 7;
    case 53: // I
        return(at.conn <= 2) ? 1 : (at.conn <= 4) ? 3 : (at.conn <= 6) ? 5 : 7;
    default:
        return at.conn;
    }
}

Chemical.prototype.findPathToRoot = function (node, path, ms)
{
    path.length = 0;
    ms.fill(false);
    var n = node;
    while(n.pv != null)
    {
        path.push(n.at);
        ms[n.at] = true;
        n = n.pv;
    }
    path.push(n.at);
    ms[n.at] = true;
}

Chemical.prototype.findShortestPath = function (node1, node2)
{
    var dist = new Array();
    var atomsArr = new Array();
    var previous = new Array();

    var unvisited = this.atoms.length;

    for(var i = 0; i < this.atoms.length; i++)
    {
        dist[i] = Number.MAX_VALUE;
        previous[i] = -1;
        atomsArr[i] = i;
    }

    dist[node1] = 0;

    while(unvisited > 0)
    {
        var u = Number.MAX_VALUE
        var pos = -1;
        for(var i = 0; i < dist.length; i++)
        {
            if(atomsArr[i] != -1 && dist[i] < u)
            {
                u = dist[i];
                pos = i;
            }
        }

        if(pos == -1)
        {
            break;
        }

        atomsArr[pos] = -1;
        unvisited--;

        for(var i = 0; i < this.atoms[pos].bo.length; i++)
        {
            var alt = dist[pos] + 1;
            var currAt = this.atoms[pos].bo[i];
            if(alt < dist[currAt])
            {
                dist[currAt] = alt;
                previous[currAt] = pos;
            }
        }
    }

    var path = new Array();
    var target = node2;
    while(previous[target] != -1)
    {
        path.splice(0, 0, target);
        target = previous[target];
    }
    return path;
}

Chemical.prototype.treeFromAtom = function (maxLevel, fr, pv, v, visited)
{
    var br = Array(2);
    br[0] = Array();
    br[1] = Array();
    var n1 = 0;
    var n2 = 1;

    v[fr] = {
        at: fr,
        pv: pv
    };
    br[n1].push(v[fr]);

    var lv = 0;
    while(br[n1].length)
    {
        br[n2].length = 0;
        for(var i = 0; i < br[n1].length; i++)
        {
            n = br[n1][i];
            fr = n.at;
            for(var j = 0; j < this.atoms[fr].bo.length; j++)
            {
                var jj = this.atoms[fr].bo[j];
                if(!visited[jj] && jj != fr)
                {
                    visited[jj] = true;
                    v[jj] = {
                        at: jj,
                        pv: n
                    };
                    br[n2].push(v[jj]);
                }
            }
        }
        lv++;
        if(lv >= maxLevel) break;
        n1 = 1 - n1;
        n2 = 1 - n2;
    }
}

function cmp_rng(a, b)
{
    for(var i = 0; i < a.length; i++)
        if(a[i] != b[i]) return a[i] - b[i];
    return 0;
}

Chemical.prototype.findRingFromBond = function (bo, rings)
{
    var nat = this.atoms.length;
    var n1 = new Array(nat);
    n1.fill(null);
    var n2 = new Array(nat);
    n2.fill(null);
    var v1 = new Array(nat);
    v1.fill(false);
    var v2 = new Array(nat);
    v2.fill(false);
    //
    v1[bo.fr] = true;
    v2[bo.to] = true;
    v2[bo.fr] = true;
    v1[bo.to] = true;

    this.treeFromAtom(90, bo.fr, null, n1, v1);
    this.treeFromAtom(90, bo.to, null, n2, v2);
    //
    var node1, node2;
    var path1 = [],
        path2 = [];
    //console.log("findRingFromBond=", bo.fr, bo.to );
    for(var i = 0; i < nat; i++)
        if((node1 = n1[i]) != null)
        {
            if((node2 = n2[n1[i].at]) != null)
            {
                this.findPathToRoot(node1, path1, v1);
                this.findPathToRoot(node2, path2, v2);
                var w = 0;
                for(var j = 0; j < v1.length; j++)
                    if(v1[j] && v2[j]) w++;
                if(w == 1)
                {
                    var rng = new Array(nat);
                    rng.fill(0);
                    path1.forEach(function (x)
                    {
                        rng[x] = 1;
                    });
                    path2.forEach(function (x)
                    {
                        rng[x] = 1;
                    });

                    var found = false;
                    for(var j = 0; j < rings.length; j++)
                        if(cmp_rng(rings[j], rng) == 0)
                        {
                            found = true;
                            break;
                        }
                    if(!found)
                        rings.push(rng);
                }
            }
        }
}

Chemical.prototype.findRings = function ()
{
    // build spanning tree and find ring closures
    var that = this;
    var nat = this.atoms.length;
    var ms = Array(nat);
    ms.fill(0);
    var rings = [];
    //
    this.rings.length = 0;
    this.atoms.forEach(function (x)
    {
        x.ms &= ~(M_AR | M_RNG);
    });
    this.bonds.forEach(function (x)
    {
        x.ms &= ~(M_AR | M_RNG);
    });
    var sum = function (ar)
    {
        var sum = 0;
        for(var i = 0; i < ar.length; i++) sum += ar[i];
        return sum;
    }
    var and = function (ar1, ar2)
    {
        for(var i = 0; i < ar1.length; i++) ar1[i] &= ar2[i];
    }
    var or = function (ar1, ar2)
    {
        for(var i = 0; i < ar1.length; i++) ar1[i] |= ar2[i];
    }
    var eq = function (ar1, ar2)
        {
            for(var i = 0; i < ar1.length; i++)
                if(ar1[i] != ar2[i]) return false;
            return true;
        }
        //
        //console.log("findRings");
        //
    var bonds = new Array(this.bonds.length);
    var tr = new Array(nat);

    for(var i = 0; i < this.bonds.length; i++)
    {
        var bo = this.bonds[i];
        bo.ms &= ~M_BO_TREE;
        bonds[i] = {
            pbo: bo,
            w: Math.min(this.atoms[bo.to].bo.length, this.atoms[bo.fr].bo.length)
        };
    }
    bonds.sort(function (a, b)
    {
        return b.w - a.w;
    });

    //console.log(bonds);

    for(var i = 0; i < nat; i++) tr[i] = i;

    for(var i = 0; i < bonds.length; i++)
    {
        var bo = bonds[i].pbo;
        if(tr[bo.fr] != tr[bo.to])
        {
            var mi = Math.min(tr[bo.fr], tr[bo.to]);
            var mx = Math.max(tr[bo.fr], tr[bo.to]);
            // join two subtrees
            for(var j = 0; j < nat; j++)
                if(tr[j] == mx) tr[j] = mi;
            bo.ms |= M_BO_TREE;
            //console.log(bo.fr,bo.to);
        }
    }
    //
    var nclosure = 0;
    for(var i = 0; i < this.bonds.length; i++)
    {
        var bo = this.bonds[i];
        if(!(bo.ms & M_BO_TREE))
        {
            // from each closure find rings
            this.findRingFromBond(bo, rings);
            //console.log(bo.fr,bo.to);
            nclosure++;
        }
    }
    // remove redundand large rings
    if(nclosure < rings.length)
    {
        rings.sort(function (r1, r2)
        {
            return sum(r2) - sum(r1);
        });
        var tmpms = new Array(nat);
        for(var i = rings.length - 1; i >= 0; i--)
        {
            tmpms.fill(0);
            for(var j = 0; j < rings.length; j++)
                if(i != j && sum(rings[j]) <= sum(rings[i]))
                    or(tmpms, rings[j]);

            and(tmpms, rings[i]);

            if(eq(tmpms, rings[i]))
            {
                rings.splice(i, 1);
            }
            if(rings.length == nclosure) break;
        }
    }
    for(var i = 0; i < rings.length; i++)
    {
        this.bonds.forEach(function (bo)
        {
            if(rings[i][bo.fr] && rings[i][bo.to])
            {
                bo.ms |= M_RNG;
                that.atoms[bo.fr].ms |= M_RNG;
                that.atoms[bo.to].ms |= M_RNG;
            }
        });
    }
    this.calcConnectivity();

    //console.log("nclosure=",nclosure,rings.length);
    // aromaticity
    var arms = new Array(rings.length);
    arms.fill(false);
    do {
        var checkMore = false;
        for(var i = 0; i < rings.length; i++)
            if(!arms[i])
            {
                var atli = [];
                for(var j = 0; j < rings[i].length; j++)
                    if(rings[i][j]) atli.push(j);

                var nel = 0;
                for(var j = 0; j < atli.length; j++)
                {
                    var at = this.atoms[atli[j]];
                    var bad = false;
                    var n = 0;

                    for(var k = 0; k < at.bo.length; k++)
                    {
                        var ord = at.ty[k] & 7;
                        if(atli.indexOf(at.bo[k]) != -1) n += (ord & 4) ? 1.5 : (ord & 3);
                        else if((ord & 3) >= 2 && !(at.ty[k] & M_RNG))
                        {
                            bad = true;
                            break;
                        }
                    }


                    if(bad)
                        break;
                    switch(at.cd)
                    {
                    case 6:
                        if(n == 3 || n == 2.5) nel += 1;
                        else
                        {
                            bad = true;
                            break;
                        }
                        break;
                    case 7:
                    case 15:
                        if(n == 3) nel += 1;
                        else if(n == 2 && atli.length == 5) nel += 2;
                        else
                        {
                            bad = true;
                            break;
                        }
                        break;
                    case 8:
                    case 16:
                        if(n == 2 && atli.length == 5) nel += 2;
                        else
                        {
                            bad = true;
                            break;
                        }
                        break;

                    }
                    //if (atli.length == 5) console.log(i,j,"at=",atli[j],"n=",n,"bad=",bad);
                    if(bad) break;
                }
                if(!bad && nel > 2 && (nel - 2) % 4 == 0)
                {
                    this.bonds.forEach(function (bo)
                    {
                        if(rings[i][bo.fr] && rings[i][bo.to])
                        {
                            bo.ms |= M_AR;
                            that.atoms[bo.fr].ms |= M_AR;
                            that.atoms[bo.to].ms |= M_AR;
                        }
                    });
                    arms[i] = true;
                    checkMore = true;
                    this.calcConnectivity();
                    //console.log("aromatic", atli);
                }
            }
        if(!checkMore) break;
    } while (true);
    // store rings
    for(var i = 0; i < rings.length; i++)
    {
        var atli = [];
        for(var j = 0; j < rings[i].length; j++)
            if(rings[i][j]) atli.push(j);
        this.rings.push(atli);
    }

}

Chemical.prototype.atomsInTheSameRing = function (at1, at2)
{
    var minsz, rnum;
    minsz = Number.MAX_VALUE;
    rnum = -1;
    for(var i = 0; i < this.rings.length; i++)
        if(this.rings[i].indexOf(at1) != -1 && this.rings[i].indexOf(at2) != -1 && this.rings[i].length < minsz)
        {
            rnum = i;
            minsz = this.rings[i].length;
        }
    return rnum;
}

function cmp_pri_lex(a, b)
{
    var i = 0;
    while(i < a.p.length && i < b.p.length)
    {
        if(a.p[i] != b.p[i]) return a.p[i] - b.p[i];
        i++;
    }
    return a.p.length - b.p.length;
}

function num_uniq_cip(p)
{
    var i, num;
    if(p.length == 0) return 0;
    num = 1;
    for(i = 0; i < p.length - 1; i++)
    {
        if(cmp_pri_lex(p[i], p[i + 1]) != 0) num++;
    }
    return num;
}

Chemical.prototype.reassign_priorities = function (p, pp)
{
    var start, end, i, j, k, iSym;
    start = 0;
    end = p.length - 1;
    iSym = 0;
    for(i = start; i <= end;)
    {
        pp++;
        j = i;
        while(j <= end && cmp_pri_lex(p[i], p[j]) == 0) j++;
        if(j > end) j = end;
        else j--;
        for(k = i; k <= j; k++)
        {
            p[k].set(pp);
        }
        i = j = j + 1;
    }
}
Chemical.prototype.assignHyb = function ()
{
    var nat = this.atoms.length;
    for(var i = 0; i < nat; i++)
    {
        var pat = this.atoms[i];

        var n_2 = 0,
            n_3 = 0,
            n_1O1 = 0,
            n_678 = 0,
            n_678_1 = 0,
            n_1_c_oq1 = 0,
            n_2q1 = 0,
            n_am = 0;
        if(pat.ms & M_AR)
        {
            pat.hyb = HYB_SP2;
            continue;
        }

        for(var j = 0; j < pat.ty.length; j++)
        {
            var bt1 = pat.ty[j]
            var p1at = this.atoms[pat.bo[j]];

            if(pat.cd == 7 || pat.cd == 8 || pat.cd == 16)
                for(var k = 0; k < p1at.ty.length; k++)
                    if(p1at.bo[k] != i)
                    {

                        var bt2 = p1at.ty[k];
                        var p2at = p1at.bo[k];

                        if(((bt2 & 15) == 2 || (bt2 & 15) == 3 || (bt2 & 4)) &&
                            ((bt1 & 15) == 1) &&
                            (p1at.cd == 6 || p1at.cd == 7 || p1at.cd == 8)
                        )
                        {
                            if((bt2 & 15) != 3) n_678_1++;
                            n_678++;
                        }
                        if((bt1 & 15) == 1 && (bt2 & 15) == 1 && p1at.cd == 6 && p2at.cd == 8 && p2at.bo.length == 1)
                            n_1_c_oq1++;

                        if((bt1 & 15) == 1 && (bt2 & 15) == 2 && p1at.cd == 6 && (p2at.cd == 8 || p2at.cd == 16))
                            n_am++;


                    }
            if((bt1 & 15) == 2)
            {
                if(pat.bo.length == 1) n_2q1++;
                n_2++;
            }
            else if((bt1 & 15) == 3) n_3++;
            else if((bt1 & 15) == 1 && p1at.cd == 8 && p1at.bo.length == 1) n_1O1++;
        }


        if(this.nbo_all(pat) > 3)
        {
            pat.hyb = HYB_SP3;
            continue;
        }

        switch(pat.cd)
        {
        case 6: // carbon
        case 14: // Si
            {
                if(n_3 == 1 || (n_2 == 2 && pat.bo.length == 2)) pat.hyb = HYB_SP1;
                else if(n_1O1 > 1) pat.hyb = HYB_SP2;
                else if(n_2 == 1) pat.hyb = HYB_SP2;
                else pat.hyb = HYB_SP3;
                break;
            }
        case 7: // nitrogen
            {
                if(n_3 == 1 || (n_2 == 2 && pat.bo.length == 2)) pat.hyb = HYB_SP1;
                else if(n_678 >= 1) pat.hyb = HYB_SP2;
                else if(n_2 == 1) pat.hyb = HYB_SP2;
                else pat.hyb = HYB_SP3;
                break;
            }
        case 8: // oxygen
            {
                if(n_3 == 1) pat.hyb = HYB_SP1;
                else if(n_1_c_oq1 == 1 && pat.bo.length == 1) pat.hyb = HYB_SP2;
                else if(n_678_1 >= 1) pat.hyb = HYB_SP2;
                else if(n_2 == 1) pat.hyb = HYB_SP2;
                else pat.hyb = HYB_SP3;
                break;
            }
        case 15: // phosphorus
        case 16: // sulfur
            {
                if(n_2q1 == 1 && pat.bo.length == 1) pat.hyb = HYB_SP2;
                else if(n_678 >= 1 && pat.bo.length == 2) pat.hyb = HYB_SP2;
                else pat.hyb = HYB_SP3;
                break;
            }
        default:
            pat.hyb = 0;

        }
    }
}

Chemical.prototype.assignChirality = function ()
{
    var signedVolume = function (nei)
    {
        var a, b, c, d, v;
        a = vector(nei[0].pat, nei[1].pat);
        b = vector(nei[0].pat, nei[2].pat);
        c = vector(nei[0].pat, nei[3].pat);
        d = vemul(a, b);
        v = scmul(d, c);
        return v;
    }

    var BOSIGN = function (bteo)
        {
            return((bteo & M_BO_DW) ? -1 : (bteo & M_BO_UP) ? 1 : 0);
        }
        //#define SIGN2STEREO(s) ((s<0.0) ? E_ATEO_OD : (s>0.0) ? E_ATEO_EV : E_ATEO_ER)

    for(var i = 0; i < this.atoms.length; i++)
    {
        var at = this.atoms[i];
        at.eo = 0;
        at.peo = 0;

        if(at.hyb != 3 || at.bo.length <= 2 || this.nbo_all(at) != 4) continue;
        var nei = [];
        var eo = 0;
        for(var k = 0; k < at.bo.length; k++)
        {
            nei[nei.length] = {
                pat: this.atoms[at.bo[k]],
                eo: at.ty[k] & (M_BO_UP | M_BO_DW),
                rng: at.ty[k] & M_RNG,
                nu: at.bo[k] + 1
            };
            eo += nei[k].eo;
        }

        nei.sort(function (aa, bb)
        {
            return bb.pat.ou - aa.pat.ou;
        });
        var ok = true;
        for(var k = 0; k < nei.length - 1; k++)
        {
            if(nei[k].pat.ou == nei[k + 1].pat.ou)
            {
                ok = false;
                break;
            }
        }

        if(!ok) continue;

        if(eo == 0)
        {
            at.eo = CHI_S | CHI_R;
            continue;
        }

        if(nei.length == 3) nei[nei.length] = {
            pat: at,
            eo: 0,
            rng: 0,
            nu: Number.MAX_VALUE
        };

        if(true /*dim()!=3*/ )
        {
            for(var k = 0; k < nei.length; k++)
            {
                nei[k].pat.z = 0.3 * BOSIGN(nei[k].eo);
            }
        }

        var v = signedVolume(nei);
        at.eo = v < 0 ? CHI_S : CHI_R;

        nei.sort(function (aa, bb)
        {
            return aa.nu - bb.nu;
        });
        // console.log( "pri=", nei.map( function (x) { return x.nu; } ) );

        var v = signedVolume(nei);
        at.peo = v < 0 ? 2 : 1;

        if(true /*dim()!=3*/ )
        {
            for(var k = 0; k < nei.length; k++)
            {
                nei[k].pat.z = 0;
            }
        }

        //console.log(nei.map( function (x) { return x.pat.ou; } ));
    }
}

Chemical.prototype.assignCIP = function ()
{
    // init
    var p = new Array(this.atoms.length);
    for(var i = 0; i < this.atoms.length; i++)
    {
        this.atoms[i].ou = 0;
        p[i] = {
            pat: this.atoms[i],
            atnum: i,
            p: [this.atoms[i].cd],
            set: function (pp)
            {
                this.p = [pp];
                this.pat.ou = pp;
            },
            sort: function ()
            {
                if(this.p.length > 2)
                {
                    var pp = this.p.sub(1, this.p.length - 1);
                    pp.sort(function (a, b)
                    {
                        return b > a ? 1 : b < a ? -1 : 0;
                    });
                    pp.unshift(this.p[0]);
                    this.p = pp;
                }

            }
        };
    }
    p.sort(cmp_pri_lex);
    this.reassign_priorities(p, 0);
    //
    var i, j, pp;
    var nat = this.atoms.length;
    do {
        var start, end, num_uniq;
        pp = 100;

        do {
            num_uniq = num_uniq_cip(p);
            //console.log( ">>>>", num_uniq );
            start = end = 0;
            while(start < nat)
            {
                while(end < nat && cmp_pri_lex(p[start], p[end]) == 0) end++;
                if(end == nat) end = nat - 1;
                else end--;
                if(end != start)
                {
                    // add neigbours priorities
                    for(i = start; i <= end; i++)
                    {
                        var pat = p[i].pat;

                        for(j = 0; j < pat.bo.length; j++)
                        {
                            var p2at = this.atoms[pat.bo[j]];

                            if(p2at.cd == 1) continue;

                            switch(pat.ty[j] & 15)
                            {
                            case 3:
                                p[i].p.push(p2at.ou);
                                // fall
                            case 2:
                                p[i].p.push(p2at.ou);
                                p[i].p.push(p2at.ou);
                                break;
                            case 5:
                            case 6:
                            case 4:
                                p[i].p.push(p2at.ou * 1.5);
                                break;
                            default:
                                p[i].p.push(p2at.ou);
                                //console.log("xxxxxxxxxxx:",p2at.ou, p[i].p);
                            }
                        }
                        //if (!atms && (cipms&ChemicalData::cipUnique) && nBonds(pat)==2 && areConnected(pat->bo[0],pat->bo[1]))
                        //  p[i].append(1);
                        p[i].sort();
                    }
                }
                start = end = end + 1;
            }

            // sort and assign new priorities
            p.sort(cmp_pri_lex);
            this.reassign_priorities(p, 0);

            //console.log( "<<<<", num_uniq_cip(p) );
            if(num_uniq == num_uniq_cip(p)) break;
        } while (true);

        // assign final priorities
        this.reassign_priorities(p, 0);
        break;

        //if (!(cipms&ChemicalData::cipUnique) || num_uniq == nat) break;

        // reassign_priorities(nat, p, 0, Ptrue(breakSym));

    } while (true);
}


Chemical.prototype.mapAtom = function (func)
{
    var res = [];
    for(var i = 0; i < this.atoms.length; i++)
    {
        var item = func(this.atoms[i], i);
        if(item != null) res.push(item);
    }
    return res;
}

Chemical.prototype.bondLength = function ()
{
    return this.bonds.length > 0 ? vectorLength(vesub(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to])) : 1.4;
}

Chemical.prototype.moveAtoms = function (atli, vect)
{
    for(var i = 0; i < atli.length; i++)
        vecpy(this.atoms[atli[i]], veadd(this.atoms[atli[i]], vect));
}


Chemical.prototype.updateAtomSelection = function (poly)
{
    for(var i = 0; i < this.atoms.length; i++)
    {
        var at = this.atoms[i];
        if(testPolyInclusion(at, poly))
            at.ms |= M_CE;
        else
            at.ms &= ~M_CE;
    }
    for(var i = 0; i < this.bonds.length; i++)
    {
        var bo = this.bonds[i];
        var at = vemulby(veadd(this.atoms[bo.fr], this.atoms[bo.to]), 0.5);
        if(testPolyInclusion(at, poly))
            bo.ms |= M_CE;
        else
            bo.ms &= ~M_CE;
    }
}

Chemical.prototype.rotateAtomsVector = function (atli, centPoint, vect, gravitateTo)
{
    if(gravitateTo != -1 && atli.length == 1)
    {
        vecpy(this.atoms[atli[0]], this.atoms[gravitateTo]);
        return;
    }

    if(atli.length == 0)
        return;

    var v = vector(centPoint, this.atoms[atli[0]]);

    if(atli.length == 1 && vectorLength(v) != this.bondLength())
    {
        v = vectorSetLength(v, this.bondLength());
        vecpy(this.atoms[atli[0]], veadd(centPoint, v));
    }


    var a = Math.acos(scmul(v, vect) / (vectorLength(v) * vectorLength(vect)));
    a = Math.round(a * TO_DEG / 12) * 12 * TO_RAD;

    this.rotateAtomsAround(atli, centPoint, a * vemulZSign(v, vect));

    // var newpos = veadd( this.atoms[centAtom], vectorSetLength( vect, vectorLength(v) ) );
    // vecpy( this.atoms[atli[0]], newpos );

}

Chemical.prototype.rotateAtomsAround = function (atli, centPoint, angle)
{
    var m = new WMatrix().rotateZAroundPoint(centPoint.x, centPoint.y, angle)
    for(var i = 0; i < atli.length; i++)
    {
        var p = m.map(this.atoms[atli[i]]);
        this.atoms[atli[i]].x = p.x;
        this.atoms[atli[i]].y = p.y;
    }
    this.calcBox();
}

Chemical.prototype.setBondLength = function (bl)
{
    if(!this.bonds.length)
        return;
    var bl2 = vectorLength(vector(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to]));
    if(Math.abs(1. - bl / bl2) < 0.1)
        return;

    var kf = bl / bl2;
    this.atoms.forEach(function (at)
    {
        vecpy(at, vemulby(at, kf));
    })
}

Chemical.prototype.expHydrogenToImp = function ()
{
    var hyd = [];
    for(var i = 0; i < this.atoms.length; i++)
    {
        if(typeof this.atoms[i].atts == "undefined")
            this.atoms[i].atts = {};
        if(typeof this.atoms[i].atts.H == "undefined")
            this.atoms[i].atts.H = 0;
        if(this.atoms[i].cd == 1) hyd.push(i);
    }
    for(var i = 0; i < this.bonds.length; i++)
    {
        var bo = this.bonds[i];
        if(this.atoms[bo.fr].cd == 1) this.atoms[bo.to].atts.H++;
        if(this.atoms[bo.to].cd == 1) this.atoms[bo.fr].atts.H++;
    }
    this.removeAtoms(hyd);
    return this;
}

Chemical.prototype.apoFromSelection = function (ms)
{
    var apo = []
    var that = this;
    this.atoms.forEach(function (at)
    {
        at.ms &= ~M_WK;
    });
    this.bonds.forEach(function (bo)
    {
        if(bo.ms & M_CE)
        {
            that.atoms[bo.fr].ms |= M_WK;
            that.atoms[bo.to].ms |= M_WK;
        }
    });

    for(var i = 0; i < this.bonds.length; i++)
    {
        var bo = this.bonds[i];
        if((this.atoms[bo.fr].ms & (M_CE | M_WK)) && !(this.atoms[bo.to].ms & (M_CE | M_WK)))
            apo.push(bo.fr);
        else if(!(this.atoms[bo.fr].ms & (M_CE | M_WK)) && (this.atoms[bo.to].ms & (M_CE | M_WK)))
            apo.push(bo.to);
    }
    return apo.sort(function (a, b)
    {
        return a - b;
    }).unique();
}

Chemical.prototype.makeAtom = function (cd)
{
    this.atoms.push(
    {
        x: 0,
        y: 0,
        z: 0,
        cd: cd,
        ms: 0
    });
    this.processChemical();
    return this;
}

Chemical.prototype.makeBond = function (angle, ty)
{
    var bl = 1.2;
    this.atoms = [];
    this.bonds = [];

    this.atoms.push(
    {
        x: 0,
        y: 0,
        z: 0,
        cd: 6,
        ms: 0
    });
    this.atoms.push(
    {
        x: bl,
        y: 1.2 * Math.tan(angle * TO_RAD),
        z: 0,
        cd: 6,
        ms: 0
    });
    this.bonds.push(
    {
        fr: 0,
        to: 1,
        ty: ty,
        ms: 0
    });
    this.processChemical();
    return this;
}

Chemical.prototype.makeMacroCycle = function (size)
{
    var bl = this.bonds.length ? vectorLength(vector(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to])) : 1.2;
    this.atoms = [];
    this.bonds = []

    var angle = 60 * TO_RAD;
    var t = 0;

    var v = {
        x: bl,
        y: 0,
        z: 0
    };
    var p = {
        x: 0,
        y: 0,
        z: 0
    };

    var size = 32;
    if(size % 2 == 0) sz = (size - 2) / 2;
    else sz = (size - 3) / 2;

    var pattern = [];
    for(var i = 0; i < sz - 1; i++) pattern.push((i % 2) ? -1 : 1);
    pattern.push(pattern[pattern.length - 1]);
    pattern.push(0);
    pattern.push(pattern[pattern.length - 2]);
    pattern.push(pattern[pattern.length - 1]);
    for(var i = 0; i < sz - 3; i++) pattern.push(-pattern[pattern.length - 1]);

    //var pattern = [ 1, -1, 1, -1, 1 ]

    for(var i = 0; i < size; i++)
    {
        //console.log(p);
        var a = {
            x: p.x,
            y: p.y,
            z: p.z,
            cd: 6,
            ms: 0,
            bo: [],
            ty: []
        }
        this.atoms[this.atoms.length] = a;
        if(i)
        {
            this.bonds[this.bonds.length] = {
                fr: i - 1,
                to: i,
                ty: 1,
                ms: 0
            };
        }
        var m = new WMatrix().rotateZAroundPoint(0, 0, angle * pattern[i % pattern.length])
        vecpy(v, m.map(v));
        p = veadd(p, v);

    }
    // this.bonds.push( { fr:0,to:this.bonds.length,ty:1,ms:0 } );


    this.processChemical();
    //console.log(this.atoms.length);
    return this;
}

Chemical.prototype.makeRing = function (size, aro)
{
    var bl = this.bonds.length ? vectorLength(vector(this.atoms[this.bonds[0].fr], this.atoms[this.bonds[0].to])) : 1.2;
    var sina2 = Math.sin(Math.PI / size);
    var r = bl / (2 * sina2);
    this.atoms = [];
    this.bonds = []

    var t = 0;

    for(var i = 0; i < size; i++)
    {
        var a = {
            x: r * Math.sin(i * 2 * Math.PI / size),
            y: r * Math.cos(i * 2 * Math.PI / size),
            z: 0,
            cd: 6,
            ms: 0,
            bo: [],
            ty: []
        }
        this.atoms[this.atoms.length] = a;
        if(i)
        {
            this.bonds[this.bonds.length] = {
                fr: i - 1,
                to: i,
                ty: aro ? t + 1 : 1,
                ms: 0
            };
            t = 1 - t;
        }
    }
    this.bonds.push(
    {
        fr: 0,
        to: this.bonds.length,
        ty: aro ? t + 1 : 1,
        ms: 0
    });
    this.processChemical();
    return this;
}

Chemical.prototype.atProp = function (at, prop, def)
{
    return typeof at.atts != "undefined" && typeof at.atts[prop] != "undefined" && at.atts[prop] ? at.atts[prop] + 1 : 0;
}

Chemical.prototype.toMol = function ()
{
    var molFile;
    var tt = new Date();
    var hasChiral = 0;
    var qfm_map = [7, 6, 6, 0, 3, 2, 1]; // -3:3

    molFile = sprintf("%s  MOLSOFT %02d%02d%02d%02d%02d2D\n\n", "\n", tt.getMonth() + 1, tt.getDate(), tt.getFullYear() % 100, tt.getHours(), tt.getMinutes());
    molFile += sprintf("%3d%3d%3d  0%3d%3d  0  0  0  0999 V2000%s", this.atoms.length, this.bonds.length, 0, hasChiral, 0, "\n");

    for(var i = 0; i < this.atoms.length; i++)
    {
        var a = this.atoms[i];
        var p = ElementNames[a.cd];
        if(p.length == 1) p += ' ';

        molFile +=
            sprintf("%10.4f%10.4f%10.4f %-3s%2d%3d%3d%3d%s",
                a.x, a.y, 0.,
                p,
                0, // wtdf,
                0, /*qfm_map[(a.qfm<-3?0:a.qfm>3?0:a.qfm)+3],*/
                a.peo, // stereo
                this.atProp(a, 'H', 0),
                "\n"
        );

    }
    for(var i = 0; i < this.bonds.length; i++)
    {
        var b = this.bonds[i];
        var eo = (b.ms & (M_BO_UP | M_BO_DW)) == M_BO_UP ? 1 : (b.ms & (M_BO_UP | M_BO_DW)) == M_BO_DW ? 6 : 0;
        molFile += sprintf("%3d%3d%3d%3d%s", b.fr + 1, b.to + 1, b.ty, eo, "\n");

    }
    // properties
    var qfm = "";
    var nqfm = 0;
    for(var i = 0; i < this.atoms.length; i++)
        if((q = this.get_qfm(this.atoms[i])))
        {
            qfm += sprintf(" %3d %3d", i + 1, q);
            nqfm++;
        }
    if(nqfm)
        molFile += sprintf("M  CHG%3d%s\n", nqfm, qfm);

    for(var i = 0; i < this.atoms.length; i++)
        if(this.atoms[i].hasOwnProperty('atts'))
        {
            var a = this.atoms[i];
            var p = "";
            for(var prop in a.atts)
                if(a.atts.hasOwnProperty(prop))
                {
                    if(p.length) p += ';'
                    p += prop + a.atts[prop];
                }
            if(p.length)
                molFile += sprintf("M  ZLS %d [%s;%s]\n", i + 1, ElementNames[a.cd], p);
        }

    molFile += "M  END\n";
    return molFile;
}

Chemical.prototype.parseMol = function (molFile)
{
    var atli = [];
    var boli = [];
    // add parsing code here
    var lines = molFile.split("\n");
    if(lines.length > 4)
    {
        var nat = parseInt(lines[3].substring(0, 3));
        var nbo = parseInt(lines[3].substring(3, 6));
        // process 'nat' lines
        var ofs = 4;
        for(var i = 0; i < nat; i++)
        {
            atli[atli.length] = {
                x: parseFloat(lines[ofs + i].substring(0, 10)),
                y: parseFloat(lines[ofs + i].substring(10, 20)),
                z: parseFloat(lines[ofs + i].substring(20, 30)),
                cd: Elements[lines[ofs + i].substring(31, 33).replace(/\s+$/, '')],
                ms: 0,
                qfm: 0,
                bo: [],
                ty: []
            };

        }
        // process 'nbo' bond
        ofs += nat;
        for(var i = 0; i < nbo; i++)
        {
            boli[boli.length] = {
                fr: parseInt(lines[ofs + i].substring(0, 3)) - 1,
                to: parseInt(lines[ofs + i].substring(3, 6)) - 1,
                ty: parseInt(lines[ofs + i].substring(6, 9)),
                ms: 0
            };
            var eo = parseInt(lines[ofs + i].substring(9, 12));
            if(eo == 1) boli[boli.length - 1].ms |= M_BO_UP;
            else if(eo == 6) boli[boli.length - 1].ms |= M_BO_DW;
        }
        ofs += nbo
        // properties
        i = 0;
        for(var i = 0; ofs + i < lines.length; i++)
        {
            if(lines[ofs + i].match(/M  ZLS/))
            {
                var prop = lines[ofs + i].substring(7).split(/[ ]+/g);
                for(var j = 0; j < prop.length; j++)
                {
                    var atnum = parseInt(prop[j]) - 1;
                    if(atnum < 0 || atnum >= atli.length) continue;
                    var atts = {};
                    var re = /([^\[\];]+);?/g;
                    var match;
                    while(match = re.exec(prop[j + 1]))
                    {
                        if(match[1] in Elements)
                            atli[atnum].cd = Elements[match[1]];
                        else
                        {
                            if(match[1].match(/[DHR][0-9]+/))
                                atts[match[1].substring(0, 1)] = parseInt(match[1].substring(1));
                        }
                    }
                    if(count_properties(atts) > 0) atli[atnum].atts = atts;
                }
            }
            else if(lines[ofs + i].match(/M  CHG/))
            {
                var prop = lines[ofs + i].substring(7).trim().split(/[ ]+/g)
                for(var j = 1; j < prop.length - 1; j += 2)
                {
                    var at = parseInt(prop[j]);
                    var chg = parseInt(prop[j + 1]);
                    if(atnum < 1 || atnum > nat) continue;
                    atli[at - 1].ms |= M_EXPLICT_QFM;
                    atli[at - 1].qfm |= chg;
                    //console.log(chg)
                }
            }
        }
    }
    this.atoms = atli;
    this.bonds = boli;
    this.setBondLength(1.2);
    this.processChemical();

    return this;
}

Chemical.prototype.parseString = function (str, onfinish)
{
    if(str.indexOf("M  END") != -1)
    {
        this.parseMol(str);
        if(typeof onfinish == "function") onfinish();
    }
    else
    {
        this.parseSmiles(str, onfinish)
    }
}

Chemical.prototype.removeAtoms = function (atli)
{
    var atmap = new Array(this.atoms.length);
    for(var i = 0; i < atli.length; i++) atmap[atli[i]] = -1;
    var n = 0;
    for(var i = 0; i < atmap.length; i++)
        if(atmap[i] != -1) atmap[i] = n++;

    for(var i = 0; i < this.bonds.length;)
    {
        if(atmap[this.bonds[i].fr] == -1 || atmap[this.bonds[i].to] == -1)
        {
            this.bonds.splice(i, 1);
        }
        else
        {
            this.bonds[i].fr = atmap[this.bonds[i].fr];
            this.bonds[i].to = atmap[this.bonds[i].to];
            i++;
        }
    }

    atli.sort(function (a, b)
    {
        return a - b
    });
    //console.log(atli);
    for(var i = atli.length - 1; i >= 0; i--) this.atoms.splice(atli[i], 1);
    this.processChemical();
}

Chemical.prototype.removeBonds = function (boli)
{
    boli.sort(function (a, b)
    {
        return a - b
    });
    for(var i = boli.length - 1; i >= 0; i--) this.bonds.splice(boli[i], 1);
    this.processChemical();
}

Chemical.prototype.findClosestBond = function (p)
{
    var bo = -1;
    for(var i = 0; i < this.bonds.length; i++)
    {
        var mid = vemulby(veadd(this.atoms[this.bonds[i].fr], this.atoms[this.bonds[i].to]), 0.5);
        if(vectorLength(vector(mid, p)) <= 0.5)
        {
            bo = i;
            break;
        }
    }
    return bo;
}

Chemical.prototype.findClosestAtom = function (p)
{
    var at = -1;
    for(var i = 0; i < this.atoms.length; i++)
    {
        if(vectorLength(vector(this.atoms[i], p)) <= closestAtomThreshold)
        {
            at = i;
            break;
        }
    }
    return at;
}

Chemical.prototype.getSelectedAtoms = function (ms)
{
    var res = [];
    for(var i = 0; i < this.atoms.length; i++)
        if(this.atoms[i].ms & ms) res.push(i);
    return res;
}


Chemical.prototype.findClosestAtomLong = function (p)
{
    if(this.atoms.length == 0)
        return -1;
    var tmp = 0;
    var d = vectorLength(vector(this.atoms[0], p));
    var d2;
    for(var i = 1; i < this.atoms.length; i++)
    {
        if((d2 = vectorLength(vector(this.atoms[i], p))) < d)
        {
            d = d2;
            tmp = i;
        }
    }
    return tmp;
}

Chemical.prototype.hasCollisions = function (atnum)
{
    for(var j = 0; j < this.atoms.length; j++)
        if(j != atnum && vectorLength(vector(this.atoms[atnum], this.atoms[j])) <= 0.2)
            return true;
    return false;
}

Chemical.prototype.gravitateCollisions = function ()
{
    var atli = [];
    var m = new Array(this.atoms.length);
    m.fill(-1);


    for(var i = 0; i < this.atoms.length; i++)
    {
        for(var j = i + 1; j < this.atoms.length; j++)
        {
            if(vectorLength(vector(this.atoms[i], this.atoms[j])) <= 0.2)
            {
                // remove i-th atom and replace all reference to 'j'
                //console.log( "gravitate: ", i, j );
                m[j] = i;
                atli.push(j);
            }
        }
    }

    if(atli.length > 0)
    {
        atli.sort(function (a, b)
        {
            return a - b
        });

        var mm = [];
        var j = 0;
        for(var i = 0; i < this.atoms.length; i++)
            if(m[i] == -1) mm[i] = j++;

            // console.log("atli=", atli, "m=", m );
        for(var i = 0; i < this.bonds.length; i++)
        {
            if(m[this.bonds[i].fr] != -1)
            {
                if(m[this.bonds[i].to] != -1)
                {
                    this.bonds.splice(i, 1);
                    i--;
                    //console.log("remove bond " + i );
                }
                else
                {
                    this.bonds[i].fr = mm[m[this.bonds[i].fr]];
                    this.bonds[i].to = mm[this.bonds[i].to];
                }
            }
            else if(m[this.bonds[i].to] != -1)
            {
                this.bonds[i].to = mm[m[this.bonds[i].to]];
                this.bonds[i].fr = mm[this.bonds[i].fr];
            }
            else
            {
                this.bonds[i].to = mm[this.bonds[i].to];
                this.bonds[i].fr = mm[this.bonds[i].fr];
            }
        }

        for(var i = atli.length - 1; i >= 0; i--) this.atoms.splice(atli[i], 1);
        //console.log("nat=", this.atoms.length, this.bonds);

        this.processChemical();
        return true;
    }
    return false;
}

Chemical.prototype.bondToggle = function (bonum, ty)
{
    var bo = this.bonds[bonum];
    var ms = bo.ms;
    bo.ms &= ~(M_BO_UP | M_BO_DW);
    if(ty == 4)
    { // up/down
        bo.ty = 1;
        if(ms & M_BO_UP)
            bo.ms |= M_BO_DW;
        else
            bo.ms |= M_BO_UP;
        var at1 = this.atoms[bo.fr];
        var at2 = this.atoms[bo.to];
        if(at1.bo.length == 1 && at2.bo.length > 1)
        {
            var t = bo.fr;
            bo.fr = bo.to;
            bo.to = t;
        }
        else if(!at1.eo && at2.eo)
        {
            var t = bo.fr;
            bo.fr = bo.to;
            bo.to = t;
        }
    }
    else if((ty == -1 || ty == 1) && !(ms & (M_BO_UP | M_BO_DW)))
    {
        var maxorder = 2;
        if(!(this.atoms[bo.fr].ms & M_RNG) && !(this.atoms[bo.to].ms & M_RNG) && this.atoms[bo.fr].bo.length <= 2 && this.atoms[bo.to].bo.length <= 2)
            maxorder = 3;
        bo.ty = bo.ty % maxorder + 1;
    }
    else bo.ty = ty;

    this.processChemical();
}

Chemical.prototype.chargeAtom = function (atnum)
{
    var at = this.atoms[atnum];
    if(typeof at.tmp == "undefined") at.tmp = 0;
    else at.tmp = (at.tmp + 1) % 5;
    switch(at.tmp)
    {
    case 0: //+2
    case 1: //+1
        at.ms |= M_EXPLICT_QFM;
        at.qfm = (at.tmp + 1);
        break;
    case 2: // auto
        at.ms &= ~M_EXPLICT_QFM;
        at.qfm = this.calc_qfm(at);
        break;
    case 3: //-1
    case 4: //-2
        at.ms |= M_EXPLICT_QFM;
        var q = at.tmp - 2;
        if(q > this.V(at) - at.conn)
        {
            at.tmp += q - this.V(at) + at.conn - 1;
            q = this.V(at) - at.conn;
        }
        at.qfm = -q;
        break;
    }
}

Chemical.prototype.changeAtom = function (atnum, cd, atts)
{
    var at = this.atoms[atnum];
    if(cd != -1) at.cd = cd;
    //console.log(atts);
    at.atts = atts;
    this.processChemical();
}

Chemical.prototype.neibVector2 = function (at, mul)
{
    var v1 = vector(at, this.atoms[at.bo[0]]);
    var v2 = vector(at, this.atoms[at.bo[1]]);
    return vectorSetLength(vemulby(veadd(v1, v2), mul), vectorLength(v1));
}

Chemical.prototype.ringCenter = function (rnum)
{
    var v = {
        x: 0,
        y: 0,
        z: 0
    };
    for(var i = 0; i < this.rings[rnum].length; i++)
    {
        v = veadd(v, this.atoms[this.rings[rnum][i]]);
    }
    return vemulby(v, 1 / this.rings[rnum].length);
}

Chemical.prototype.bondOrtho = function (atnum1, atnum2, ty, len)
{
    var at1 = this.atoms[atnum1];
    var at2 = this.atoms[atnum2];

    if((at1.bo.length == 1 && at2.bo.length == 1) || ty == 3)
    {
        var v = vectorSetLength(vector(at1, at2), len);
        return {
            x: -v.y,
            y: v.x,
            z: 0
        }
    }
    else
    {
        var rnum = this.atomsInTheSameRing(atnum1, atnum2);
        //
        if(rnum != -1)
        {
            //console.log(atnum1,atnum2,rnum);
            var v = vector(at1, at2);
            var rv = vector(vemulby(veadd(at1, at2), 0.5), this.ringCenter(rnum));
            return vectorSetLength(rv, len);
        }
        //console.log(rnum);
        //
        var atnum3 = -1;
        if(at1.bo.length > 1)
        {
            for(var i = 0; i < at1.bo.length; i++)
                if(at1.bo[i] != atnum2 && this.atomsInTheSameRing(at1.bo[i], atnum2) != -1)
                {
                    atnum3 = at1.bo[i];
                    break;
                }
            if(atnum3 == -1)
                for(var i = 0; i < at1.bo.length; i++)
                    if(at1.bo[i] != atnum2)
                    {
                        atnum3 = at1.bo[i];
                        break;
                    }
        }
        else
        {
            for(var i = 0; i < at2.bo.length; i++)
                if(at2.bo[i] != atnum1 && this.atomsInTheSameRing(at2.bo[i], atnum1) != -1)
                {
                    atnum3 = at2.bo[i];
                    break;
                }
            if(atnum3 == -1)
                for(var i = 0; i < at2.bo.length; i++)
                    if(at2.bo[i] != atnum1)
                    {
                        atnum3 = at2.bo[i];
                        break;
                    }
        }
        var at3 = this.atoms[atnum3];
        var v1 = vector(at1, at2);
        var v2 = vector(at2, at3);
        var v = vemul(vemul(v1, v2), v1);
        return vectorSetLength(v, len);
    }
}

Chemical.prototype.placeFragment = function (pos, frag)
{
    var that = this;
    frag = clone_object(frag);
    var d = vesub(pos, frag.centerPoint());

    var n = this.atoms.length;

    frag.atoms.forEach(function (x)
    {
        vecpy(x, veadd(x, d));
        that.atoms.push(x);
    });
    frag.bonds.forEach(function (x)
    {
        that.bonds.push(
        {
            fr: x.fr + n,
            to: x.to + n,
            ty: x.ty,
            ms: 0
        });
    });
    this.processChemical();
}

Chemical.prototype.connectToBond = function (bonum, frag)
{
    var that = this;
    var bo = this.bonds[bonum];
    var tobonum = 0;

    var aro = frag.atoms.length == 6 && (frag.atoms[0].ms & M_AR)

    frag = clone_object(frag);

    if(aro)
    {
        for(var i = 0; i < frag.bonds.length; i++)
            if(frag.bonds[i].ty == bo.ty)
            {
                tobonum = i;
                break;
            }
        if((bo.ms & M_AR) && frag.bonds[tobonum].ty == 1)
        {
            var t = 0;
            for(var i = 1; i <= 5; i++)
            {
                frag.bonds[(tobonum + i) % frag.bonds.length].ty = t + 1;
                t = 1 - t;
            }
        }
    }

    var tobo = frag.bonds[tobonum];

    var v1 = vemulby(this.bondOrtho(bo.fr, bo.to, 1, 1.), -1);
    var p1 = vemulby(veadd(this.atoms[bo.fr], this.atoms[bo.to]), 0.5);

    var v2 = frag.bondOrtho(tobo.fr, tobo.to, 1, 1.);
    var p2 = vemulby(veadd(frag.atoms[tobo.fr], frag.atoms[tobo.to]), 0.5);

    var angle = Math.acos(Math.max(-1., Math.min(1., scmul(v1, v2) / (vectorLength(v1) * vectorLength(v2))))) * vemulZSign(v2, v1);

    var d = vesub(p1, p2);
    var mt = new WMatrix().rotateZAroundPoint(p1.x, p1.y, angle);
    var n = this.atoms.length;

    frag.atoms.forEach(function (x)
    {
        vecpy(x, mt.map(veadd(x, d)));
        that.atoms.push(clone_object(x));
    });
    frag.bonds.forEach(function (x)
    {
        that.bonds.push(
        {
            fr: x.fr + n,
            to: x.to + n,
            ty: x.ty,
            ms: 0
        });
    });

    if(!this.gravitateCollisions())
        this.processChemical();
}

Chemical.prototype.chainTo = function (atnum, ty, mouseLast, mouseCurrent)
{
    var that = this;
    var at = this.atoms[atnum];
    var mouseVec = vector(at, mouseCurrent);

    var toat = null;

    var newpos;

    if(at.bo.length == 0)
    {
        var v = {
            x: 1.2,
            y: 0,
            z: 0
        };
        var a = Math.acos(scmul(v, mouseVec) / (vectorLength(v) * vectorLength(mouseVec))) * vemulZSign(v, mouseVec);
        a = Math.round(a * TO_DEG / 12) * 12 * TO_RAD;
        v.x = 1.2 * Math.cos(a);
        v.y = 1.2 * Math.sin(a);
        newpos = veadd(at, v);
    }
    else
    {
        var at2 = this.atoms[at.bo[0]];
        var v = vector(at2, at);
        newpos = veadd(at, v);
        newpos = (new WMatrix().rotateZAroundPoint(at.x, at.y, -vemulZSign(v, vector(mouseCurrent, at2)) * Math.PI / 3)).map(newpos);
    }

    var newat = {
        x: newpos.x,
        y: newpos.y,
        z: 0,
        cd: 6,
        bo: [],
        ty: []
    };
    this.atoms.push(newat);
    this.bonds.push(
    {
        fr: atnum,
        to: this.atoms.length - 1,
        ty: ty,
        ms: 0
    });
    this.processChemical(); // gravitateCollisions will be done later
    return this.atoms.length - 1;
}

Chemical.prototype.connectTo = function (atnum, ty, frag, toatnum)
{
    var that = this;
    var at = this.atoms[atnum];
    var newpos = null;

    if(ty == 3 && at.bo.length != 1)
        return [];

    var toat = null;
    if(frag != null)
    {
		frag = clone_object(frag);

        toat = frag.atoms[toatnum];

        if(at.bo.length == 2 && toat.bo.length == 2)
        {
            newpos = veadd(toat, frag.neibVector2(toat, -1));
            toat = {
                x: newpos.x,
                y: newpos.y,
                z: 0,
                cd: 6,
                bo: [],
                ty: []
            };
            frag.atoms.push(toat);
            frag.bonds.push(
            {
                fr: toatnum,
                to: frag.atoms.length - 1,
                ty: 1,
                ms: 0
            });
            toatnum = frag.atoms.length - 1;
            frag.calcConnectivity();
            toat = frag.atoms[toatnum];
        }

        //console.log("at.bo.length=",at.bo.length,"toat.bo.length", toat.bo.length );

        var dir;
        switch(at.bo.length)
        {
        case 0:
            dir = {
                x: 1.2,
                y: 0,
                z: 0
            };
            break;
        case 1:
            dir = vector(at, this.atoms[at.bo[0]]);
            break;
        case 2:
            dir = this.neibVector2(at, -1);
            break;
        default:
            //console.log("at.bo.length == ", at.bo.length );
            return [];
        }

        var v;

        switch(toat.bo.length)
        {
        case 0:
            v = {
                x: 1.2,
                y: 0,
                z: 0
            };
            break;
        case 1:
            v = vector(toat, frag.atoms[toat.bo[0]]);
            break;
        case 2:
            v = frag.neibVector2(toat, -1);
            break;
        default:
            //console.log("toat.bo.length == ", toat.bo.length );
            return [];
        }
        var angle = Math.acos(scmul(v, dir) / (vectorLength(v) * vectorLength(dir))) * vemulZSign(v, dir);

        var atli = [];

        var d = vesub(at, toat);
        var mt = new WMatrix().rotateZAroundPoint(at.x, at.y, angle);
        var n = this.atoms.length;
        var m = [],
            i = 0;
        frag.atoms.forEach(function (x)
        {
            vecpy(x, mt.map(veadd(x, d)));
            if(x != toat)
            {
                m[i] = n;
                atli.push(n++);
                that.atoms.push(clone_object(x));
            }
            else m[i] = atnum;
            i++;
        });
        frag.bonds.forEach(function (x)
        {
            that.bonds.push(
            {
                fr: m[x.fr],
                to: m[x.to],
                ty: x.ty,
                ms: 0
            });
        });

        this.processChemical();
        return atli;
    }
    // bond mode
    switch(at.bo.length)
    {
    case 0:
        {
            newpos = veadd(at,
            {
                x: 1.2,
                y: 0,
                z: 0
            });
        }
        break;
    case 1:
        {
            var at2 = this.atoms[at.bo[0]];
            var v = vector(at2, at);
            if(ty == 3 || (ty == 2 && at.ty[0] == 2))
            {
                newpos = veadd(at, v);
            }
            else
            {
                if(at2.bo.length == 2)
                {
                    var i = at2.bo[0] == atnum ? at2.bo[1] : at2.bo[0];
                    newpos = veadd(at, vector(this.atoms[i], at2));
                }
                else
                {
                    newpos = veadd(at, v);
                    newpos = (new WMatrix().rotateZAroundPoint(at.x, at.y, Math.PI / 3)).map(newpos);
                }
            }
        }
        break;
    case 2:
        {
            var v1 = vector(at, this.atoms[at.bo[0]]);
            var v2 = vector(at, this.atoms[at.bo[1]]);
            newpos = veadd(at, vectorSetLength(vemulby(veadd(v1, v2), -1), vectorLength(v1)));
        }
        break;
    default:
        {
            var maxAngle = 0;
            var ii = -1,
                jj = -1;
            for(var i = 0; i < at.bo.length; i++)
            {
                var v1 = vector(at, this.atoms[at.bo[i]]);
                for(var j = 0; j < at.bo.length; j++)
                    if(i != j)
                    {
                        var v2 = vector(at, this.atoms[at.bo[j]]);
                        var a = Math.acos(scmul(v1, v2) / (vectorLength(v1) * vectorLength(v2)));

                        var v = veadd(v1, v2);
                        var ok = true;
                        for(var k = 0; k < at.bo.length; k++)
                            if(k != i && k != j)
                            {
                                var vv = vector(at, this.atoms[at.bo[k]]);
                                var a1 = Math.acos(scmul(v1, vv) / (vectorLength(v1) * vectorLength(vv)));
                                var a2 = Math.acos(scmul(v2, vv) / (vectorLength(v2) * vectorLength(vv)));
                                //console.log( at.bo[i],  at.bo[j],  at.bo[k], a1,a2,a );
                                if(Math.abs((a1 + a2) - a) <= 0.001)
                                {
                                    ok = false;
                                    break;
                                }
                            }
                        if(!ok) continue;
                        //console.log(i,j,a);
                        if(a > maxAngle)
                        {
                            maxAngle = a;
                            ii = i;
                            jj = j;
                        }
                    }
            }
            if(ii != -1 && jj != -1)
            {
                var v1 = vector(at, this.atoms[at.bo[ii]]);
                var v2 = vector(at, this.atoms[at.bo[jj]]);
                newpos = veadd(at, vectorSetLength(veadd(v1, v2), vectorLength(v1)));
            }
        }
        break;
    }

    if(newpos != null)
    {
        var newat = {
            x: newpos.x,
            y: newpos.y,
            z: 0,
            cd: 6,
            bo: [],
            ty: []
        };
        this.atoms.push(newat);
        var ms = 0;
        if(ty == 4)
        {
            ty = 1;
            ms = M_BO_UP;
        }
        this.bonds.push(
        {
            fr: atnum,
            to: this.atoms.length - 1,
            ty: ty,
            ms: ms
        });
        this.processChemical();
        return [this.atoms.length - 1];
    }

    return [];
}

function vector(at1, at2)
{
	return {
		x: at2.x - at1.x,
		y: at2.y - at1.y,
		z: at2.z - at1.z
	}
}

function vectorLength(v)
{
	return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function vectorSetLength(v, l)
{
	var k = l / vectorLength(v);
	return {
		x: v.x * k,
		y: v.y * k,
		z: v.z * k
	}
}

function vecpy(a, b)
{
	a.x = b.x;
	a.y = b.y;
	a.z = b.z;
}

function veadd(a, b)
{
	return {
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z
	}
}

function vesub(a, b)
{
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z
	}
}

function vemul(a, b)
{
	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	}
}

function vemulZSign(a, b)
{
	var v = a.x * b.y - a.y * b.x;
	return v < 0 ? -1 : 1;
}

function scmul(a, b)
{
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function vemulby(a, k)
{
	return {
		x: a.x * k,
		y: a.y * k,
		z: a.z * k
	}
}

function xyz(at)
{
	return {
		x: at.x,
		y: at.y,
		z: at.z
	}
}

function testPolyInclusion(p, poly)
{
	var np = poly.length;
	var c = false;
	var i = 0;
	var j = np - 1;
	for(var k = 0; k < np; k++)
	{
		if(poly[i].y <= p.y)
		{
			if((p.y < poly[j].y) && (p.x - poly[i].x) * (poly[j].y - poly[i].y) < (poly[j].x - poly[i].x) * (p.y - poly[i].y))
				c = !c;
		}
		else
		{
			if((p.y >= poly[j].y) && (p.x - poly[i].x) * (poly[j].y - poly[i].y) > (poly[j].x - poly[i].x) * (p.y - poly[i].y))
				c = !c;
		}
		j = i;
		i++;
	}
	return c;
}

function angleBetween(a, b)
{
	return TO_DEG * Math.acos((scmul(a, b)) / (vectorLength(a) * vectorLength(b)));
}

var Rings = [
	(new Chemical())
	.makeRing(6, true), (new Chemical())
	.makeRing(3, false), (new Chemical())
	.makeRing(4, false), (new Chemical())
	.makeRing(5, false), (new Chemical())
	.makeRing(6, false), (new Chemical())
	.makeRing(7, false)
];
